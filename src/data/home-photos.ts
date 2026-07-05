import { birds } from "@/data/birds";

export type HomePhoto = {
  birdSlug: string;
  birdCommonName: string;
  birdScientificName: string;
};

export const homePhotos: HomePhoto[] = birds
  .flatMap((bird) =>
    bird.photos.map((photo) => ({
      ...photo,
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
