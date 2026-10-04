"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

import { getBirdById } from "@/lib/birds";
import { createR2UploadUrl, deleteFromR2, getR2PublicUrl } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";

type SaveUploadedPhotoInput = {
  birdId: string;
  photoId: string;
  alt: string;
  title: string;
  camera: string;
  lens: string;

  card: {
    width: number;
    height: number;
    sizeBytes: number;
  };

  large: {
    width: number;
    height: number;
    sizeBytes: number;
  };
};

export async function createPhotoUploadUrls(birdId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autorizado.");
  }

  const bird = await getBirdById(birdId);

  if (!bird) {
    throw new Error("El ave no existe.");
  }

  const photoId = randomUUID();

  const cardKey = `birds/${birdId}/${photoId}/card.webp`;

  const largeKey = `birds/${birdId}/${photoId}/large.webp`;

  const [cardUploadUrl, largeUploadUrl] = await Promise.all([
    createR2UploadUrl(cardKey),
    createR2UploadUrl(largeKey),
  ]);

  return {
    photoId,

    card: {
      key: cardKey,
      uploadUrl: cardUploadUrl,
      publicUrl: getR2PublicUrl(cardKey),
    },

    large: {
      key: largeKey,
      uploadUrl: largeUploadUrl,
      publicUrl: getR2PublicUrl(largeKey),
    },
  };
}

export async function cleanupUploadedPhoto(birdId: string, photoId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autorizado.");
  }

  const cardKey = `birds/${birdId}/${photoId}/card.webp`;

  const largeKey = `birds/${birdId}/${photoId}/large.webp`;

  await cleanupR2Files(cardKey, largeKey);
}

export async function saveUploadedPhoto(input: SaveUploadedPhotoInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autorizado.");
  }

  const bird = await getBirdById(input.birdId);

  if (!bird) {
    throw new Error("El ave no existe.");
  }

  const alt = input.alt.trim();

  if (!alt) {
    throw new Error("El texto alternativo es obligatorio.");
  }

  const cardKey = `birds/${input.birdId}/${input.photoId}/card.webp`;

  const largeKey = `birds/${input.birdId}/${input.photoId}/large.webp`;

  const { error: photoError } = await supabase.from("photos").insert({
    id: input.photoId,
    bird_id: input.birdId,
    alt,
    title: input.title.trim() || null,
    camera: input.camera.trim(),
    lens: input.lens.trim(),
  });

  if (photoError) {
    await cleanupR2Files(cardKey, largeKey);

    throw new Error("No se ha podido guardar la fotografía.");
  }

  const { error: variantsError } = await supabase
    .from("photo_variants")
    .insert([
      {
        photo_id: input.photoId,
        variant_type: "card",
        storage_path: cardKey,
        public_url: getR2PublicUrl(cardKey),
        width: input.card.width,
        height: input.card.height,
        size_bytes: input.card.sizeBytes,
        format: "webp",
      },
      {
        photo_id: input.photoId,
        variant_type: "large",
        storage_path: largeKey,
        public_url: getR2PublicUrl(largeKey),
        width: input.large.width,
        height: input.large.height,
        size_bytes: input.large.sizeBytes,
        format: "webp",
      },
    ]);

  if (variantsError) {
    await supabase.from("photos").delete().eq("id", input.photoId);

    await cleanupR2Files(cardKey, largeKey);

    throw new Error("No se han podido guardar las variantes de la fotografía.");
  }

  revalidatePath("/");
  revalidatePath("/birds");
  revalidatePath(`/birds/${bird.slug}`);

  return {
    birdSlug: bird.slug,
  };
}

async function cleanupR2Files(cardKey: string, largeKey: string) {
  await Promise.allSettled([deleteFromR2(cardKey), deleteFromR2(largeKey)]);
}
