"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChangeEvent,
  SubmitEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react";

type PhotoUploadFormProps = {
  birdId: string;
  birdSlug: string;
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const inputClassName =
  "mt-2 w-full rounded-xl border border-(--color-border) bg-transparent px-4 py-3 font-normal text-sm text-(--color-text) outline-none transition placeholder:text-(--color-text-muted) placeholder:italic placeholder:opacity-40 focus:border-(--color-border-accent)";

const labelClassName = "text-md font-medium text-(--color-text)";

export const PhotoUploadForm = ({ birdId, birdSlug }: PhotoUploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedInfo, setProcessedInfo] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (!file) {
      return null;
    }

    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    setError(null);
    setProcessedInfo(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.has(selectedFile.type)) {
      setFile(null);
      event.target.value = "";
      setError("Selecciona una imagen JPG, PNG o WebP.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      event.target.value = "";
      setError("La imagen no puede superar los 50 MB.");
      return;
    }

    setFile(selectedFile);
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Selecciona una fotografía.");
      return;
    }

    setError(null);
    setProcessedInfo(null);
    setIsProcessing(true);

    try {
      const bitmap = await createImageBitmap(file);

      try {
        const card = await createWebpVariant(bitmap, 1200, 0.82);
        const large = await createWebpVariant(bitmap, 2400, 0.9);

        setProcessedInfo(
          `Variantes preparadas: card ${formatBytes(card.size)} · large ${formatBytes(large.size)}`,
        );
      } finally {
        bitmap.close();
      }
    } catch {
      setError("No se ha podido procesar la fotografía seleccionada.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <input type="hidden" name="birdId" value={birdId} />

      <div>
        <label className={labelClassName}>
          Fotografía original
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp"
            required
            onChange={handleFileChange}
            className={`${inputClassName} cursor-pointer`}
          />
        </label>

        <p className="mt-2 text-sm text-(--color-text-muted)">
          La imagen original no se almacenará. Se generarán las variantes
          optimizadas para la web.
        </p>
      </div>

      {previewUrl && (
        <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-(--color-border)">
          <Image
            src={previewUrl}
            alt="Previsualización de la fotografía seleccionada"
            fill
            unoptimized
            className="object-contain"
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <label className={labelClassName}>
          Texto alternativo
          <input
            type="text"
            name="alt"
            placeholder="Calamón común caminando entre vegetación.."
            required
            className={inputClassName}
          />
        </label>

        <label className={labelClassName}>
          Título
          <input
            type="text"
            name="title"
            placeholder="Calamón común en la marisma.."
            className={inputClassName}
          />
        </label>

        <label className={labelClassName}>
          Cámara
          <input
            type="text"
            name="camera"
            placeholder="Canon EOS R5.."
            className={inputClassName}
          />
        </label>

        <label className={labelClassName}>
          Objetivo
          <input
            type="text"
            name="lens"
            placeholder="RF 100-500mm F4.5-7.1 L IS USM.."
            className={inputClassName}
          />
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      )}

      {processedInfo && (
        <p className="rounded-xl border border-(--color-border) px-4 py-3 text-sm text-(--color-text-muted)">
          {processedInfo}
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
          disabled={!file || isProcessing}
          className="inline-flex cursor-pointer rounded-md border border-(--color-border) bg-(--color-button-background) px-4 py-2 text-sm font-medium text-white transition hover:border-(--color-border-accent) hover:text-(--color-accent) disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? "Procesando..." : "Preparar fotografía"}
        </button>
      </div>
    </form>
  );
};

async function createWebpVariant(
  source: ImageBitmap,
  maxSize: number,
  quality: number,
): Promise<Blob> {
  const scale = Math.min(1, maxSize / Math.max(source.width, source.height));

  const width = Math.round(source.width * scale);
  const height = Math.round(source.height * scale);

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create canvas context");
  }

  context.drawImage(source, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", quality);
  });

  if (!blob) {
    throw new Error("Could not generate WebP image");
  }

  return blob;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
