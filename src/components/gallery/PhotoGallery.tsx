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

import { useRouter } from "next/navigation";
import { deleteBirdPhotos } from "@/app/admin/birds/[birdId]/photos/actions";
import { Photo } from "@/types/photo";

type PhotoGalleryProps = {
  photos: Photo[];
  birdId?: string;
  canSelectPhotos?: boolean;
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
  birdId,
  birdCommonName,
  birdScientificName,
  canSelectPhotos = false,
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
    ? "max-h-[58svh] md:max-h-[68svh] lg:max-h-[72vh] max-lg:landscape:max-h-[92svh]"
    : "max-h-[78svh] max-lg:landscape:max-h-[92svh] lg:max-h-[90vh]";

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function openPhoto(index: number) {
    setSelectedPhotoIndex(index);
    setSlideDirection(null);
  }

  function togglePhotoSelection(photoId: string) {
    setSelectedPhotoIds((current) =>
      current.includes(photoId)
        ? current.filter((id) => id !== photoId)
        : [...current, photoId],
    );
  }

  function toggleSelectionMode() {
    if (isSelectionMode) {
      setSelectedPhotoIds([]);
    }

    setIsSelectionMode((current) => !current);
  }

  async function handleDeletePhotos() {
    if (!birdId || selectedPhotoIds.length === 0 || isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const { deletedIds, failedIds } = await deleteBirdPhotos(
        birdId,
        selectedPhotoIds,
      );

      setIsDeleteModalOpen(false);

      if (deletedIds.length > 0) {
        router.refresh();
      }

      if (failedIds.length > 0) {
        setSelectedPhotoIds(failedIds);
        setDeleteError(
          `No se han podido eliminar ${failedIds.length} fotografías. Puedes volver a intentarlo.`,
        );
        return;
      }

      setSelectedPhotoIds([]);
      setIsSelectionMode(false);
    } catch (error) {
      console.error("Error deleting photos:", error);
      setIsDeleteModalOpen(false);
      setDeleteError("Se ha producido un error al eliminar las fotografías.");
    } finally {
      setIsDeleting(false);
    }
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

  useEffect(() => {
    if (!isDeleteModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDeleting) {
        setIsDeleteModalOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isDeleteModalOpen, isDeleting]);

  return (
    <section>
      {canSelectPhotos && photos.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={toggleSelectionMode}
            className="inline-flex cursor-pointer rounded-md border border-(--color-border) bg-(--color-button-background) px-4 py-2 text-sm font-medium text-(--color-text) transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
          >
            {isSelectionMode ? "Cancelar" : "Seleccionar"}
          </button>

          {deleteError && (
            <p role="alert" className="mb-4 text-sm text-red-300">
              {deleteError}
            </p>
          )}

          {isSelectionMode && (
            <button
              type="button"
              disabled={selectedPhotoIds.length === 0}
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex cursor-pointer rounded-md border border-red-800 bg-red-950/60 px-4 py-2 text-sm font-medium text-red-200 transition hover:border-red-600 hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Eliminar ({selectedPhotoIds.length})
            </button>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visiblePhotos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => {
              if (isSelectionMode) {
                togglePhotoSelection(photo.id);
              } else {
                openPhoto(index);
              }
            }}
            aria-pressed={
              isSelectionMode ? selectedPhotoIds.includes(photo.id) : undefined
            }
            className={`relative group cursor-pointer overflow-hidden border-2 bg-(--color-surface) shadow-lg shadow-black/30 transition hover:border-(--color-border-accent) ${
              isSelectionMode && selectedPhotoIds.includes(photo.id)
                ? "border-(--color-accent)"
                : "border-(--color-border)/60"
            }`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={800}
              height={600}
              className={`aspect-4/3 w-full object-cover transition duration-300 ${
                isSelectionMode
                  ? selectedPhotoIds.includes(photo.id)
                    ? "brightness-50"
                    : "brightness-100"
                  : "group-hover:scale-102"
              }`}
            />

            {isSelectionMode && (
              <span
                aria-hidden="true"
                className={`absolute right-3 top-3 z-10 flex size-6 items-center justify-center rounded-full border-2 text-sm font-bold shadow-lg ${
                  selectedPhotoIds.includes(photo.id)
                    ? "border-white bg-red-800 text-white"
                    : "border-white bg-black/50 text-white"
                }`}
              >
                {selectedPhotoIds.includes(photo.id) ? "✕" : ""}
              </span>
            )}
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
                className="flex w-fit min-w-0 max-w-full flex-col"
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
                  <figcaption className="mt-4 flex w-full min-w-0 flex-col gap-4 contain-[inline-size] md:flex-row md:items-start max-lg:landscape:hidden">
                    <div className="min-w-0 text-left md:max-w-[40%] md:shrink-0">
                      {selectedBirdCommonName && (
                        <p className="text-lg font-semibold text-white">
                          {selectedBirdCommonName}
                        </p>
                      )}

                      {selectedBirdScientificName && (
                        <p className="mt-1 text-sm italic text-white/60">
                          {selectedBirdScientificName}
                        </p>
                      )}
                    </div>

                    {(selectedPhoto.title ||
                      selectedPhoto.camera ||
                      selectedPhoto.lens) && (
                      <div className="min-w-0 text-left md:flex-1 md:self-stretch md:border-l md:border-white/15 md:pl-4">
                        {selectedPhoto.title && (
                          <p
                            title={selectedPhoto.title}
                            className="line-clamp-2 text-sm font-medium text-white/90 wrap-anywhere"
                          >
                            {selectedPhoto.title}
                          </p>
                        )}

                        {selectedPhoto.camera && (
                          <p className="mt-1 text-xs text-white/60">
                            Cámara: {selectedPhoto.camera}
                          </p>
                        )}

                        {selectedPhoto.lens && (
                          <p className="mt-1 text-xs text-white/60">
                            Objetivo: {selectedPhoto.lens}
                          </p>
                        )}
                      </div>
                    )}

                    {showBirdLink && selectedBirdSlug && (
                      <Link
                        href={`/birds/${selectedBirdSlug}`}
                        className="hidden w-fit shrink-0 rounded-xl border border-(--color-border) bg-(--color-button-background) px-4 py-2 text-sm font-medium text-white transition hover:border-(--color-border-accent) hover:text-(--color-accent) md:ml-auto md:inline-flex"
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

      {isDeleteModalOpen && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (!isDeleting && event.target === event.currentTarget) {
              setIsDeleteModalOpen(false);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-photos-title"
            aria-describedby="delete-photos-description"
            className="w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-2xl shadow-black/50"
          >
            <h2
              id="delete-photos-title"
              className="text-xl font-semibold text-(--color-text)"
            >
              Eliminar fotografías
            </h2>

            <p
              id="delete-photos-description"
              className="mt-3 leading-7 text-(--color-text-muted)"
            >
              ¿Seguro que quieres eliminar las{" "}
              <strong className="font-semibold text-(--color-text)">
                {selectedPhotoIds.length}
              </strong>{" "}
              fotografías seleccionadas?
            </p>

            <p className="mt-2 text-sm text-red-300">
              Esta acción es permanente y no se puede deshacer.
            </p>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="inline-flex cursor-pointer rounded-md border border-(--color-border) px-4 py-2 text-sm font-medium text-(--color-text) transition hover:border-(--color-border-accent) disabled:opacity-40"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeletePhotos}
                className="inline-flex cursor-pointer rounded-md border border-red-800 bg-red-950/60 px-4 py-2 text-sm font-medium text-red-200 transition hover:border-red-600 hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isDeleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
