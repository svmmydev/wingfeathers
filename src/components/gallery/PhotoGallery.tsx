"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Photo = {
  id: string;
  src: string;
  alt: string;
};

type PhotoGalleryProps = {
  photos: Photo[];
};

const INITIAL_VISIBLE_PHOTOS = 8;
const PHOTOS_PER_LOAD = 8;

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [visiblePhotoCount, setVisiblePhotoCount] = useState(
    INITIAL_VISIBLE_PHOTOS,
  );
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );

  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

  const visiblePhotos = photos.slice(0, visiblePhotoCount);
  const hasMorePhotos = visiblePhotoCount < photos.length;

  const selectedPhoto =
    selectedPhotoIndex === null ? null : visiblePhotos[selectedPhotoIndex];

  const isLightboxOpen = selectedPhotoIndex !== null;

  function openPhoto(index: number) {
    setSelectedPhotoIndex(index);
  }

  const closePhoto = useCallback(() => {
    setSelectedPhotoIndex(null);
  }, []);

  const showPreviousPhoto = useCallback(() => {
    setSelectedPhotoIndex((currentIndex) => {
      if (currentIndex === null) return currentIndex;

      return currentIndex === 0 ? visiblePhotos.length - 1 : currentIndex - 1;
    });
  }, [visiblePhotos.length]);

  const showNextPhoto = useCallback(() => {
    setSelectedPhotoIndex((currentIndex) => {
      if (currentIndex === null) return currentIndex;

      return currentIndex === visiblePhotos.length - 1 ? 0 : currentIndex + 1;
    });
  }, [visiblePhotos.length]);

  useEffect(() => {
    if (!hasMorePhotos) return;

    const triggerElement = loadMoreTriggerRef.current;

    if (!triggerElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry.isIntersecting) return;

        setVisiblePhotoCount((currentCount) =>
          Math.min(currentCount + PHOTOS_PER_LOAD, photos.length),
        );
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      },
    );

    observer.observe(triggerElement);

    return () => {
      observer.disconnect();
    };
  }, [hasMorePhotos, photos.length]);

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
    <section>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visiblePhotos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => openPhoto(index)}
            className="group overflow-hidden border-2 border-(--color-border)/60 bg-(--color-surface) shadow-lg shadow-black/30 transition hover:border-(--color-border-accent)"
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

      {hasMorePhotos && (
        <div ref={loadMoreTriggerRef} className="h-12" aria-hidden="true" />
      )}

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
              className="max-h-[90vh] w-auto object-contain shadow-2xl shadow-black/70"
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
    </section>
  );
}
