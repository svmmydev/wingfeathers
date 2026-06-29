import { birds } from "@/data/birds";

export type HomePhoto = {
  id: string;
  src: string;
  alt: string;
  uploadedAt: string;
  birdSlug: string;
  birdCommonName: string;
  birdScientificName: string;
};

export const homePhotos: HomePhoto[] = birds
  .flatMap((bird) =>
    bird.photos.map((photo) => ({
      id: photo.id,
      src: photo.src,
      alt: photo.alt,
      uploadedAt: photo.uploadedAt,
      birdSlug: bird.slug,
      birdCommonName: bird.commonName,
      birdScientificName: bird.scientificName,
    })),
  )
  .sort((firstPhoto, secondPhoto) => {
    return (
      new Date(secondPhoto.uploadedAt).getTime() -
      new Date(firstPhoto.uploadedAt).getTime()
    );
  });
