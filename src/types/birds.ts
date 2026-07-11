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
  photos: BirdPhoto[];
};

export type HomePhoto = BirdPhoto & {
  birdSlug: string;
  birdCommonName: string;
  birdScientificName: string;
};
