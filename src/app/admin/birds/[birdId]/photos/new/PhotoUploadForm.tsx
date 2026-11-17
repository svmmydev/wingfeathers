"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChangeEvent, SubmitEventHandler } from "react";
import { useEffect, useRef, useState } from "react";
import { MAX_PHOTOS_PER_BIRD, PHOTO_FIELD_LIMITS } from "@/lib/constants";

import {
  cleanupUploadedPhoto,
  createPhotoUploadUrls,
  saveUploadedPhoto,
} from "./actions";

type PhotoUploadFormProps = {
  birdId: string;
  birdSlug: string;
  existingPhotoCount: number;
};

type PhotoItem = {
  id: string;
  file: File;
  previewUrl: string;
  alt: string;
  title: string;
  camera: string;
  lens: string;
  cameraOverridden: boolean;
  lensOverridden: boolean;
};

type WebpVariant = {
  blob: Blob;
  width: number;
  height: number;
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const inputClassName =
  "mt-2 w-full rounded-xl border border-(--color-border) bg-transparent px-4 py-3 font-normal text-sm text-(--color-text) outline-none transition placeholder:text-(--color-text-muted) placeholder:italic placeholder:opacity-40 focus:border-(--color-border-accent) disabled:cursor-not-allowed disabled:opacity-50";

const labelClassName = "text-md font-medium text-(--color-text)";

export const PhotoUploadForm = ({
  birdId,
  birdSlug,
  existingPhotoCount,
}: PhotoUploadFormProps) => {
  const router = useRouter();

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [commonCamera, setCommonCamera] = useState("");
  const [commonLens, setCommonLens] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [savedPhotoCount, setSavedPhotoCount] = useState(existingPhotoCount);

  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  const previewUrlsRef = useRef<Set<string>>(new Set());

  const isMultiple = photos.length > 1;

  const remainingSlots = Math.max(
    0,
    MAX_PHOTOS_PER_BIRD - savedPhotoCount - photos.length,
  );

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;

    return () => {
      for (const previewUrl of previewUrls) {
        URL.revokeObjectURL(previewUrl);
      }

      previewUrls.clear();
    };
  }, []);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    event.target.value = "";

    if (selectedFiles.length > remainingSlots) {
      setError(`Solo puedes añadir ${remainingSlots} fotografías más.`);

      return;
    }

    const newPhotos: PhotoItem[] = [];

    let hasInvalidType = false;
    let hasInvalidSize = false;

    for (const selectedFile of selectedFiles) {
      if (!ALLOWED_IMAGE_TYPES.has(selectedFile.type)) {
        hasInvalidType = true;
        continue;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        hasInvalidSize = true;
        continue;
      }

      const previewUrl = URL.createObjectURL(selectedFile);

      previewUrlsRef.current.add(previewUrl);

      newPhotos.push({
        id: crypto.randomUUID(),
        file: selectedFile,
        previewUrl,
        alt: "",
        title: "",
        camera: commonCamera,
        lens: commonLens,
        cameraOverridden: false,
        lensOverridden: false,
      });
    }

    setPhotos((currentPhotos) => [...currentPhotos, ...newPhotos]);

    if (hasInvalidType && hasInvalidSize) {
      setError(
        "Algunas imágenes se han ignorado porque no tienen un formato válido o superan los 50 MB.",
      );
    } else if (hasInvalidType) {
      setError(
        "Algunas imágenes se han ignorado. Solo se admiten JPG, PNG y WebP.",
      );
    } else if (hasInvalidSize) {
      setError("Algunas imágenes se han ignorado porque superan los 50 MB.");
    } else {
      setError(null);
    }
  }

  function updatePhotoText(
    photoId: string,
    field: "alt" | "title",
    value: string,
  ) {
    setPhotos((currentPhotos) =>
      currentPhotos.map((photo) =>
        photo.id === photoId
          ? {
              ...photo,
              [field]: value,
            }
          : photo,
      ),
    );
  }

  function updatePhotoCamera(photoId: string, value: string) {
    setPhotos((currentPhotos) =>
      currentPhotos.map((photo) =>
        photo.id === photoId
          ? {
              ...photo,
              camera: value,
              cameraOverridden: true,
            }
          : photo,
      ),
    );
  }

  function updatePhotoLens(photoId: string, value: string) {
    setPhotos((currentPhotos) =>
      currentPhotos.map((photo) =>
        photo.id === photoId
          ? {
              ...photo,
              lens: value,
              lensOverridden: true,
            }
          : photo,
      ),
    );
  }

  function handleCommonCameraChange(value: string) {
    setCommonCamera(value);

    setPhotos((currentPhotos) =>
      currentPhotos.map((photo) =>
        photo.cameraOverridden
          ? photo
          : {
              ...photo,
              camera: value,
            },
      ),
    );
  }

  function handleCommonLensChange(value: string) {
    setCommonLens(value);

    setPhotos((currentPhotos) =>
      currentPhotos.map((photo) =>
        photo.lensOverridden
          ? photo
          : {
              ...photo,
              lens: value,
            },
      ),
    );
  }

  function applyCommonCamera(photoId: string) {
    setPhotos((currentPhotos) =>
      currentPhotos.map((photo) =>
        photo.id === photoId
          ? {
              ...photo,
              camera: commonCamera,
              cameraOverridden: false,
            }
          : photo,
      ),
    );
  }

  function applyCommonLens(photoId: string) {
    setPhotos((currentPhotos) =>
      currentPhotos.map((photo) =>
        photo.id === photoId
          ? {
              ...photo,
              lens: commonLens,
              lensOverridden: false,
            }
          : photo,
      ),
    );
  }

  function removePhoto(photoId: string) {
    setPhotos((currentPhotos) => {
      const photo = currentPhotos.find((item) => item.id === photoId);

      if (photo) {
        releasePreviewUrl(photo.previewUrl);
      }

      return currentPhotos.filter((item) => item.id !== photoId);
    });
  }

  function releasePreviewUrl(previewUrl: string) {
    URL.revokeObjectURL(previewUrl);
    previewUrlsRef.current.delete(previewUrl);
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (photos.length === 0) {
      setError("Selecciona al menos una fotografía.");
      return;
    }

    const hasMissingAlt = photos.some((photo) => !photo.alt.trim());

    if (hasMissingAlt) {
      setError("Todas las fotografías deben tener texto alternativo.");
      return;
    }

    setError(null);
    setIsUploading(true);

    const uploadedPhotoIds: string[] = [];

    try {
      for (let index = 0; index < photos.length; index++) {
        const photo = photos[index];

        setUploadProgress({
          current: index + 1,
          total: photos.length,
        });

        const bitmap = await createImageBitmap(photo.file);

        let card: WebpVariant;
        let large: WebpVariant;

        try {
          card = await createWebpVariant(bitmap, 1200, 0.82);
          large = await createWebpVariant(bitmap, 2400, 0.95);
        } finally {
          bitmap.close();
        }

        const upload = await createPhotoUploadUrls(birdId);

        const [cardResponse, largeResponse] = await Promise.all([
          fetch(upload.card.uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "image/webp",
            },
            body: card.blob,
          }),

          fetch(upload.large.uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "image/webp",
            },
            body: large.blob,
          }),
        ]);

        if (!cardResponse.ok || !largeResponse.ok) {
          await cleanupUploadedPhoto(birdId, upload.photoId);

          throw new Error("No se han podido subir las imágenes a R2.");
        }

        await saveUploadedPhoto({
          birdId,
          photoId: upload.photoId,
          alt: photo.alt.trim(),
          title: photo.title.trim(),
          camera: photo.camera.trim(),
          lens: photo.lens.trim(),

          card: {
            width: card.width,
            height: card.height,
            sizeBytes: card.blob.size,
          },

          large: {
            width: large.width,
            height: large.height,
            sizeBytes: large.blob.size,
          },
        });

        uploadedPhotoIds.push(photo.id);
      }

      router.push(`/birds/${birdSlug}`);
      router.refresh();
    } catch (error) {
      console.error(error);

      if (uploadedPhotoIds.length > 0) {
        setSavedPhotoCount(
          (currentCount) => currentCount + uploadedPhotoIds.length,
        );

        const uploadedIds = new Set(uploadedPhotoIds);

        for (const photo of photos) {
          if (uploadedIds.has(photo.id)) {
            releasePreviewUrl(photo.previewUrl);
          }
        }

        setPhotos((currentPhotos) =>
          currentPhotos.filter((photo) => !uploadedIds.has(photo.id)),
        );

        setError(
          `Se han subido ${uploadedPhotoIds.length} de ${photos.length} fotografías. Las restantes siguen pendientes.`,
        );
      } else {
        setError("No se han podido subir las fotografías.");
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <p className={labelClassName}>Fotografías</p>

        <input
          type="file"
          name="photos"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={isUploading || remainingSlots === 0}
          onChange={handleFileChange}
          aria-label="Seleccionar fotografías"
          className="
            mt-6 w-full max-w-md cursor-pointer
            rounded-xl border border-(--color-border)
            bg-transparent px-3 py-2
            text-sm text-(--color-text-muted)
            outline-none transition
            file:mr-4
            file:cursor-pointer
            file:rounded-md
            file:border
            file:border-(--color-border)
            file:bg-(--color-button-background)
            file:px-4
            file:py-2
            file:text-sm
            file:font-medium
            file:text-(--color-text)
            hover:file:border-(--color-border-accent)
            hover:file:text-(--color-accent)
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        />

        <p className="mt-4 text-sm text-(--color-text-muted)">
          Fotografías almacenadas: {savedPhotoCount} de {MAX_PHOTOS_PER_BIRD}.
        </p>

        <p className="mt-1 text-sm text-(--color-text-muted)">
          Espacios disponibles: {remainingSlots}.
        </p>
      </div>

      {photos.length > 0 && (
        <p className="text-sm text-(--color-text-muted)">
          {photos.length === 1
            ? "1 fotografía seleccionada"
            : `${photos.length} fotografías seleccionadas`}
        </p>
      )}

      {isMultiple && (
        <div className="rounded-xl border border-(--color-border) p-5">
          <div>
            <h2 className="text-lg font-medium text-(--color-text)">
              Valores comunes
            </h2>

            <p className="mt-1 text-sm text-(--color-text-muted)">
              Se aplicarán a las fotografías que no tengan un valor individual
              diferente.
            </p>
          </div>

          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <label className={labelClassName}>
              Cámara
              <input
                type="text"
                value={commonCamera}
                maxLength={PHOTO_FIELD_LIMITS.camera}
                disabled={isUploading}
                placeholder="Canon EOS R5.."
                onChange={(event) =>
                  handleCommonCameraChange(event.target.value)
                }
                className={inputClassName}
              />
            </label>

            <label className={labelClassName}>
              Objetivo
              <input
                type="text"
                value={commonLens}
                maxLength={PHOTO_FIELD_LIMITS.lens}
                disabled={isUploading}
                placeholder="RF 100-500mm F4.5-7.1 L IS USM.."
                onChange={(event) => handleCommonLensChange(event.target.value)}
                className={inputClassName}
              />
            </label>
          </div>
        </div>
      )}

      {photos.length === 1 && (
        <div className="grid gap-8 rounded-xl border border-(--color-border) p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-black/10">
              <Image
                src={photos[0].previewUrl}
                alt="Previsualización de la fotografía"
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            <div className="mt-2 flex items-center justify-between gap-4">
              <p className="truncate text-xs text-(--color-text-muted)">
                {photos[0].file.name}
              </p>

              <button
                type="button"
                disabled={isUploading}
                onClick={() => removePhoto(photos[0].id)}
                className="shrink-0 cursor-pointer text-sm text-(--color-text-muted) transition hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Quitar
              </button>
            </div>
          </div>

          <div className="grid content-start gap-5">
            <label className={labelClassName}>
              Título
              <input
                type="text"
                value={photos[0].title}
                maxLength={PHOTO_FIELD_LIMITS.title}
                disabled={isUploading}
                placeholder="Calamón común en la marisma.."
                onChange={(event) =>
                  updatePhotoText(photos[0].id, "title", event.target.value)
                }
                className={inputClassName}
              />
              <span className="mt-1 block text-right text-xs font-normal text-(--color-text-muted)">
                {photos[0].title.length} / {PHOTO_FIELD_LIMITS.title}
              </span>
            </label>

            <label className={labelClassName}>
              Texto alternativo
              <input
                type="text"
                value={photos[0].alt}
                required
                disabled={isUploading}
                placeholder="Calamón común caminando entre vegetación.."
                onChange={(event) =>
                  updatePhotoText(photos[0].id, "alt", event.target.value)
                }
                className={inputClassName}
              />
            </label>

            <label className={labelClassName}>
              Cámara
              <input
                type="text"
                value={photos[0].camera}
                maxLength={PHOTO_FIELD_LIMITS.camera}
                disabled={isUploading}
                placeholder="Canon EOS R5.."
                onChange={(event) =>
                  updatePhotoCamera(photos[0].id, event.target.value)
                }
                className={inputClassName}
              />
            </label>

            <label className={labelClassName}>
              Objetivo
              <input
                type="text"
                value={photos[0].lens}
                disabled={isUploading}
                placeholder="RF 100-500mm F4.5-7.1 L IS USM.."
                onChange={(event) =>
                  updatePhotoLens(photos[0].id, event.target.value)
                }
                className={inputClassName}
              />
            </label>
          </div>
        </div>
      )}

      {isMultiple && (
        <div className="space-y-6">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="grid gap-6 rounded-xl border border-(--color-border) p-5 md:grid-cols-3"
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-black/10">
                  <Image
                    src={photo.previewUrl}
                    alt={`Previsualización ${index + 1}`}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>

                <p className="mt-2 truncate text-xs text-(--color-text-muted)">
                  {photo.file.name}
                </p>
              </div>

              <div className="space-y-5 md:col-span-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex w-full items-center">
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => removePhoto(photo.id)}
                      className="ml-auto cursor-pointer text-sm text-(--color-text-muted) transition hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Quitar
                    </button>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className={labelClassName}>
                    Texto alternativo
                    <input
                      type="text"
                      value={photo.alt}
                      maxLength={PHOTO_FIELD_LIMITS.alt}
                      required
                      disabled={isUploading}
                      placeholder="Calamón común caminando entre vegetación.."
                      onChange={(event) =>
                        updatePhotoText(photo.id, "alt", event.target.value)
                      }
                      className={inputClassName}
                    />
                  </label>

                  <label className={labelClassName}>
                    Título
                    <input
                      type="text"
                      value={photo.title}
                      maxLength={PHOTO_FIELD_LIMITS.title}
                      disabled={isUploading}
                      placeholder="Calamón común en la marisma.."
                      onChange={(event) =>
                        updatePhotoText(photo.id, "title", event.target.value)
                      }
                      className={inputClassName}
                    />
                    <span className="mt-1 block text-right text-xs font-normal text-(--color-text-muted)">
                      {photo.title.length} / {PHOTO_FIELD_LIMITS.title}
                    </span>
                  </label>

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <p className={labelClassName}>Cámara</p>

                      {photo.cameraOverridden && (
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => applyCommonCamera(photo.id)}
                          className="cursor-pointer text-xs text-amber-400 transition hover:text-amber-300 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Usar común
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={photo.camera}
                      maxLength={PHOTO_FIELD_LIMITS.camera}
                      disabled={isUploading}
                      placeholder="Canon EOS R5.."
                      aria-label={`Cámara de la fotografía ${index + 1}`}
                      onChange={(event) =>
                        updatePhotoCamera(photo.id, event.target.value)
                      }
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <p className={labelClassName}>Objetivo</p>

                      {photo.lensOverridden && (
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => applyCommonLens(photo.id)}
                          className="cursor-pointer text-xs text-amber-400 transition hover:text-amber-300 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Usar común
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={photo.lens}
                      maxLength={PHOTO_FIELD_LIMITS.lens}
                      disabled={isUploading}
                      placeholder="RF 100-500mm F4.5-7.1 L IS USM.."
                      aria-label={`Objetivo de la fotografía ${index + 1}`}
                      onChange={(event) =>
                        updatePhotoLens(photo.id, event.target.value)
                      }
                      className={inputClassName}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-3 pt-6">
        <Link
          href={`/birds/${birdSlug}`}
          className="inline-flex rounded-md border border-(--color-border) px-4 py-2 text-sm font-medium text-(--color-text) transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={photos.length === 0 || isUploading}
          className="inline-flex cursor-pointer rounded-md border border-(--color-border) bg-(--color-button-background) px-4 py-2 text-sm font-medium text-white transition hover:border-(--color-border-accent) hover:text-(--color-accent) disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading && uploadProgress
            ? `Subiendo ${uploadProgress.current} de ${uploadProgress.total}...`
            : photos.length === 1
              ? "Añadir fotografía"
              : `Añadir ${photos.length} fotografías`}
        </button>
      </div>
    </form>
  );
};

async function createWebpVariant(
  source: ImageBitmap,
  maxSize: number,
  quality: number,
): Promise<WebpVariant> {
  const scale = Math.min(1, maxSize / Math.max(source.width, source.height));

  const width = Math.round(source.width * scale);

  const height = Math.round(source.height * scale);

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("No se ha podido crear el contexto del canvas.");
  }

  context.drawImage(source, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", quality);
  });

  if (!blob) {
    throw new Error("No se ha podido generar la imagen WebP.");
  }

  return {
    blob,
    width,
    height,
  };
}
