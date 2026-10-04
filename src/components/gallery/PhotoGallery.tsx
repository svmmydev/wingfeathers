"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";

type Photo = {
  id: string;
  src: string;
  largeSrc?: string;
  alt: string;
  birdSlug?: string;
  birdCommonName?: string;
  birdScientificName?: string;
};

type PhotoGalleryProps = {
  photos: Photo[];
  showPhotoInfo?: boolean;
  showBirdLink?: boolean;
  birdCommonName?: string;
  birdScientificName?: string;
};

type SlideDirection = "previous" | "next" | null;

const INITIAL_VISIBLE_PHOTOS = 8;
const PHOTOS_PER_LOAD = 8;

const MIN_SWIPE_DISTANCE = 50;
const MAX_VERTICAL_SWIPE_DISTANCE = 80;

export function PhotoGallery({
  photos,
  showPhotoInfo = false,
  showBirdLink = false,
  birdCommonName,
  birdScientificName,
}: PhotoGalleryProps) {
  const [visiblePhotoCount, setVisiblePhotoCount] = useState(
    INITIAL_VISIBLE_PHOTOS,
  );

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );

  const [slideDirection, setSlideDirection] = useState<SlideDirection>(null);

  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

  const pointerStartXRef = useRef<number | null>(null);
  const pointerStartYRef = useRef<number | null>(null);

  const visiblePhotos = photos.slice(0, visiblePhotoCount);
  const hasMorePhotos = visiblePhotoCount < photos.length;
  const canNavigatePhotos = visiblePhotos.length > 1;

  const selectedPhoto =
    selectedPhotoIndex === null
      ? null
      : (visiblePhotos[selectedPhotoIndex] ?? null);

  const selectedBirdCommonName =
    selectedPhoto?.birdCommonName ?? birdCommonName;

  const selectedBirdScientificName =
    selectedPhoto?.birdScientificName ?? birdScientificName;

  const selectedBirdSlug = selectedPhoto?.birdSlug;

  const shouldShowPhotoInfo =
    showPhotoInfo &&
    Boolean(selectedBirdCommonName || selectedBirdScientificName);

  const isLightboxOpen = selectedPhoto !== null;

  const lightboxImageSizeClass = shouldShowPhotoInfo
    ? "max-h-[78svh] max-lg:landscape:max-h-[92svh] lg:max-h-[82vh]"
    : "max-h-[78svh] max-lg:landscape:max-h-[92svh] lg:max-h-[90vh]";

  function openPhoto(index: number) {
    setSelectedPhotoIndex(index);
    setSlideDirection(null);
  }

  const closePhoto = useCallback(() => {
    setSelectedPhotoIndex(null);
    setSlideDirection(null);
  }, []);

  const showPreviousPhoto = useCallback(() => {
    if (selectedPhotoIndex === null || !canNavigatePhotos) return;

    const previousIndex =
      selectedPhotoIndex === 0
        ? visiblePhotos.length - 1
        : selectedPhotoIndex - 1;

    setSlideDirection("previous");
    setSelectedPhotoIndex(previousIndex);
  }, [selectedPhotoIndex, visiblePhotos.length, canNavigatePhotos]);

  const showNextPhoto = useCallback(() => {
    if (selectedPhotoIndex === null || !canNavigatePhotos) return;

    const nextIndex =
      selectedPhotoIndex === visiblePhotos.length - 1
        ? 0
        : selectedPhotoIndex + 1;

    setSlideDirection("next");
    setSelectedPhotoIndex(nextIndex);
  }, [selectedPhotoIndex, visiblePhotos.length, canNavigatePhotos]);

  function resetPointerPosition() {
    pointerStartXRef.current = null;
    pointerStartYRef.current = null;
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!canNavigatePhotos || event.pointerType === "mouse") {
      resetPointerPosition();
      return;
    }

    pointerStartXRef.current = event.clientX;
    pointerStartYRef.current = event.clientY;
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!canNavigatePhotos) {
      resetPointerPosition();
      return;
    }

    if (
      pointerStartXRef.current === null ||
      pointerStartYRef.current === null
    ) {
      resetPointerPosition();
      return;
    }

    const horizontalDistance = event.clientX - pointerStartXRef.current;
    const verticalDistance = event.clientY - pointerStartYRef.current;

    resetPointerPosition();

    if (Math.abs(horizontalDistance) < MIN_SWIPE_DISTANCE) return;
    if (Math.abs(verticalDistance) > MAX_VERTICAL_SWIPE_DISTANCE) return;

    if (horizontalDistance > 0) {
      showPreviousPhoto();
      return;
    }

    showNextPhoto();
  }

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
            className="cursor-pointer group overflow-hidden border-2 border-(--color-border)/60 bg-(--color-surface) shadow-lg shadow-black/30 transition hover:border-(--color-border-accent)"
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
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/80 px-2 py-3 backdrop-blur-sm md:px-4 md:py-6 max-lg:landscape:px-1 max-lg:landscape:py-1"
          role="dialog"
          aria-modal="true"
          aria-label="Visor de fotografía"
          onClick={closePhoto}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              closePhoto();
            }}
            className="absolute right-4 top-4 z-20 rounded-full border-2 border-(--color-border) bg-black/60 px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-black"
          >
            Cerrar
          </button>

          <div className="flex w-full max-w-[100vw] flex-col items-center justify-center lg:max-w-[1600px]">
            <div
              className="relative flex w-full touch-pan-y select-none items-center justify-center px-0 md:px-12 lg:px-14"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={resetPointerPosition}
            >
              {canNavigatePhotos && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    showPreviousPhoto();
                  }}
                  className="absolute left-0 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-(--color-border) bg-black/50 text-3xl text-white transition hover:bg-white hover:text-black md:flex"
                  aria-label="Ver imagen anterior"
                >
                  <span className="-translate-y-1 leading-none">‹</span>
                </button>
              )}

              <figure
                className="flex w-fit max-w-full flex-col"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="relative flex w-fit max-w-full items-center justify-center overflow-hidden">
                  <div
                    key={selectedPhoto.id}
                    className={`relative flex w-fit max-w-full items-center justify-center ${
                      slideDirection === "next"
                        ? "lightbox-slide-in-from-right"
                        : slideDirection === "previous"
                          ? "lightbox-slide-in-from-left"
                          : ""
                    }`}
                  >
                    <Image
                      src={selectedPhoto.largeSrc ?? selectedPhoto.src}
                      alt={selectedPhoto.alt}
                      width={1600}
                      height={1200}
                      draggable={false}
                      className={`h-auto w-auto max-w-full object-contain ${lightboxImageSizeClass}`}
                      priority
                    />
                  </div>
                </div>

                {canNavigatePhotos && (
                  <div className="mt-4 flex w-full items-center justify-between md:hidden max-lg:landscape:hidden">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        showPreviousPhoto();
                      }}
                      className="flex size-10 items-center justify-center rounded-full border-2 border-(--color-border) bg-black/50 text-3xl text-white transition hover:bg-white hover:text-black"
                      aria-label="Ver imagen anterior"
                    >
                      <span className="-translate-y-1 leading-none">‹</span>
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        showNextPhoto();
                      }}
                      className="flex size-10 items-center justify-center rounded-full border-2 border-(--color-border) bg-black/50 text-3xl text-white transition hover:bg-white hover:text-black"
                      aria-label="Ver imagen siguiente"
                    >
                      <span className="-translate-y-1 leading-none">›</span>
                    </button>
                  </div>
                )}

                {shouldShowPhotoInfo && (
                  <figcaption className="mt-4 hidden w-full items-center justify-between gap-3 md:flex [@media_(max-width:900px)_and_(max-height:500px)]:hidden">
                    <div className="min-w-0 text-left">
                      {selectedBirdCommonName && (
                        <p className="truncate text-base font-semibold text-white sm:text-lg">
                          {selectedBirdCommonName}
                        </p>
                      )}

                      {selectedBirdScientificName && (
                        <p className="mt-1 truncate text-sm italic text-white/70">
                          {selectedBirdScientificName}
                        </p>
                      )}
                    </div>

                    {showBirdLink && selectedBirdSlug && (
                      <Link
                        href={`/birds/${selectedBirdSlug}`}
                        className="inline-flex w-fit shrink-0 rounded-xl border border-(--color-border) bg-(--color-button-background) px-4 py-2 text-sm font-medium text-white transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
                      >
                        Ver ficha
                      </Link>
                    )}
                  </figcaption>
                )}
              </figure>

              {canNavigatePhotos && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    showNextPhoto();
                  }}
                  className="absolute right-0 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-(--color-border) bg-black/50 text-3xl text-white transition hover:bg-white hover:text-black md:flex"
                  aria-label="Ver imagen siguiente"
                >
                  <span className="-translate-y-1 leading-none">›</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
