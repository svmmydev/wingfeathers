export type Photo = {
  id: string;
  src: string;
  largeSrc?: string;
  alt: string;
  title?: string;
  camera?: string;
  lens?: string;
  birdId?: string;
  birdSlug?: string;
  birdCommonName?: string;
  birdScientificName?: string;
};

export type UpdatePhotoInput = {
  birdId: string;
  photoId: string;
  title: string;
  alt: string;
  camera: string;
  lens: string;
};
