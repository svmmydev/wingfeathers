import { createClient } from "@/lib/supabase/server";
import type { Bird, BirdPhoto } from "@/data/birds";

type PhotoVariantRow = {
  variant_type: "card" | "large";
  public_url: string;
};

type PhotoRow = {
  id: string;
  title: string | null;
  alt: string;
  camera: string;
  lens: string;
  uploaded_at: string;
  photo_variants: PhotoVariantRow[];
};

type BirdRow = {
  id: string;
  slug: string;
  common_name: string;
  scientific_name: string;
  family: string;
  is_native: boolean;
  geography: string;
  description: string;
  habitat: string;
  feeding: string;
  behavior: string;
  breeding: string;
  size: string;
  photos: PhotoRow[];
};

function mapPhoto(photo: PhotoRow): BirdPhoto {
  const cardVariant = photo.photo_variants.find(
    (variant) => variant.variant_type === "card",
  );

  const largeVariant = photo.photo_variants.find(
    (variant) => variant.variant_type === "large",
  );

  return {
    id: photo.id,
    title: photo.title ?? undefined,
    src: largeVariant?.public_url ?? cardVariant?.public_url ?? "",
    alt: photo.alt,
    uploadedAt: photo.uploaded_at,
    camera: photo.camera,
    lens: photo.lens,
  };
}

function mapBird(bird: BirdRow): Bird {
  return {
    id: bird.id,
    slug: bird.slug,
    commonName: bird.common_name,
    scientificName: bird.scientific_name,
    family: bird.family,
    isNative: bird.is_native,
    geography: bird.geography,
    description: bird.description,
    habitat: bird.habitat,
    feeding: bird.feeding,
    behavior: bird.behavior,
    breeding: bird.breeding,
    size: bird.size,
    photos: bird.photos.map(mapPhoto).sort((firstPhoto, secondPhoto) => {
      return (
        new Date(secondPhoto.uploadedAt).getTime() -
        new Date(firstPhoto.uploadedAt).getTime()
      );
    }),
  };
}

export async function getBirds(): Promise<Bird[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("birds")
    .select(
      `
        id,
        slug,
        common_name,
        scientific_name,
        family,
        is_native,
        geography,
        description,
        habitat,
        feeding,
        behavior,
        breeding,
        size,
        photos (
          id,
          title,
          alt,
          camera,
          lens,
          uploaded_at,
          photo_variants (
            variant_type,
            public_url
          )
        )
      `,
    )
    .order("common_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as BirdRow[]).map(mapBird);
}

export async function getBirdBySlug(slug: string): Promise<Bird | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("birds")
    .select(
      `
        id,
        slug,
        common_name,
        scientific_name,
        family,
        is_native,
        geography,
        description,
        habitat,
        feeding,
        behavior,
        breeding,
        size,
        photos (
          id,
          title,
          alt,
          camera,
          lens,
          uploaded_at,
          photo_variants (
            variant_type,
            public_url
          )
        )
      `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapBird(data as BirdRow);
}

export type HomePhoto = BirdPhoto & {
  birdSlug: string;
  birdCommonName: string;
  birdScientificName: string;
};

type HomeBirdRow = {
  slug: string;
  common_name: string;
  scientific_name: string;
};

type HomePhotoRow = {
  id: string;
  title: string | null;
  alt: string;
  camera: string;
  lens: string;
  uploaded_at: string;
  photo_variants: PhotoVariantRow[];
  bird: HomeBirdRow | HomeBirdRow[] | null;
};

function getRelatedBird(bird: HomePhotoRow["bird"]): HomeBirdRow | null {
  if (Array.isArray(bird)) {
    return bird[0] ?? null;
  }

  return bird;
}

function mapHomePhoto(photo: HomePhotoRow): HomePhoto {
  const bird = getRelatedBird(photo.bird);

  const cardVariant = photo.photo_variants.find(
    (variant) => variant.variant_type === "card",
  );

  const largeVariant = photo.photo_variants.find(
    (variant) => variant.variant_type === "large",
  );

  return {
    id: photo.id,
    title: photo.title ?? undefined,
    src: largeVariant?.public_url ?? cardVariant?.public_url ?? "",
    alt: photo.alt,
    uploadedAt: photo.uploaded_at,
    camera: photo.camera,
    lens: photo.lens,
    birdSlug: bird?.slug ?? "",
    birdCommonName: bird?.common_name ?? "",
    birdScientificName: bird?.scientific_name ?? "",
  };
}

export async function getHomePhotos(): Promise<HomePhoto[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photos")
    .select(
      `
        id,
        title,
        alt,
        camera,
        lens,
        uploaded_at,
        bird:birds (
          slug,
          common_name,
          scientific_name
        ),
        photo_variants (
          variant_type,
          public_url
        )
      `,
    )
    .order("uploaded_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as HomePhotoRow[]).map(mapHomePhoto);
}
