"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Photo = {
  id: string;
  src: string;
  alt: string;
};

type HomePhotoGalleryProps = {
  photos: Photo[];
};

export function HomePhotoGallery({ photos }: HomePhotoGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );

  function openPhoto(index: number) {
    setSelectedPhotoIndex(index);
  }

  const closePhoto = useCallback(() => {
    setSelectedPhotoIndex(null);
  }, []);

  const showPreviousPhoto = useCallback(() => {
    setSelectedPhotoIndex((currentIndex) => {
      if (currentIndex === null) return currentIndex;

      return currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
    });
  }, [photos.length]);

  const showNextPhoto = useCallback(() => {
    setSelectedPhotoIndex((currentIndex) => {
      if (currentIndex === null) return currentIndex;

      return currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
    });
  }, [photos.length]);

  const isLightboxOpen = selectedPhotoIndex !== null;

  const selectedPhoto =
    selectedPhotoIndex === null ? null : photos[selectedPhotoIndex];

  useEffect(() => {
    if (!isLightboxOpen) return;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLightboxOpen]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePhoto();
      }

      if (event.key === "ArrowLeft") {
        showPreviousPhoto();
      }

      if (event.key === "ArrowRight") {
        showNextPhoto();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, closePhoto, showPreviousPhoto, showNextPhoto]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => openPhoto(index)}
            className="group overflow-hidden rounded-2xl border-2 border-(--color-border)/60 shadow-lg shadow-black/30 transition hover:border-(--color-border-accent)"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={800}
              height={600}
              className="aspect-4/3 w-full object-cover transition duration-300 group-hover:scale-102"
            />
          </button>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={closePhoto}
        >
          <button
            type="button"
            onClick={closePhoto}
            className="absolute right-5 top-5 rounded-full border-2 border-(--color-border) bg-black/40 px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-black"
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPreviousPhoto();
            }}
            className="absolute left-10 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-(--color-border) text-3xl text-white transition hover:bg-white hover:text-black"
            aria-label="Ver imagen anterior"
          >
            <span className="-translate-y-1 leading-none">‹</span>
          </button>

          <div
            className="max-h-[90vh] px-18"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              width={1600}
              height={1200}
              className="max-h-[90vh] w-auto rounded-2xl object-contain shadow-2xl shadow-black/70"
              priority
            />
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNextPhoto();
            }}
            className="absolute right-10 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-(--color-border) text-3xl text-white transition hover:bg-white hover:text-black"
            aria-label="Ver imagen siguiente"
          >
            <span className="-translate-y-1 leading-none">›</span>
          </button>
        </div>
      )}
    </>
  );
}
