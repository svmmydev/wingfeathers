export type BirdPhoto = {
  id: string;
  src: string;
  largeSrc?: string;
  alt: string;
  uploadedAt: string;
  title?: string;
  camera?: string;
  lens?: string;
};

export type Bird = {
  id: string;
  slug: string;
  commonName: string;
  scientificName: string;
  family: string;
  isNative: boolean;
  geography: string;
  description: string;
  habitat: string;
  feeding: string;
  behavior: string;
  breeding: string;
  size: string;
  wingspan: string;
  photos: BirdPhoto[];
};

export type HomePhoto = BirdPhoto & {
  birdId: string;
  birdSlug: string;
  birdCommonName: string;
  birdScientificName: string;
};

export type PhotoVariantRow = {
  variant_type: "card" | "large";
  public_url: string;
};

export type PhotoRow = {
  id: string;
  title: string | null;
  alt: string;
  camera: string;
  lens: string;
  uploaded_at: string;
  photo_variants: PhotoVariantRow[];
};

export type BirdRow = {
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
  wingspan: string;
  photos: PhotoRow[];
};

export type HomeBirdRow = {
  slug: string;
  common_name: string;
  scientific_name: string;
};

export type HomePhotoRow = {
  id: string;
  bird_id: string;
  title: string | null;
  alt: string;
  camera: string;
  lens: string;
  uploaded_at: string;
  photo_variants: PhotoVariantRow[];
  bird: HomeBirdRow | HomeBirdRow[] | null;
};
