"use server";

import { randomUUID } from "crypto";

import { getBirdById } from "@/lib/birds";
import { createR2UploadUrl, getR2PublicUrl } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";

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
