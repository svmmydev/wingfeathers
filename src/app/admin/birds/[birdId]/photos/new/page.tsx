import Link from "next/link";
import { notFound } from "next/navigation";

import { PhotoUploadForm } from "./PhotoUploadForm";
import { getBirdById } from "@/lib/birds";

type NewBirdPhotoPageProps = {
  params: Promise<{
    birdId: string;
  }>;
};

export default async function NewBirdPhotoPage({
  params,
}: NewBirdPhotoPageProps) {
  const { birdId } = await params;

  const bird = await getBirdById(birdId);

  if (!bird) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-(--color-accent)">
            Panel de administración
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--color-text)">
            Añadir fotografía
          </h1>

          <p className="mt-2 text-(--color-text-muted)">
            Añade una nueva fotografía de {bird.commonName}.
          </p>
        </div>

        <Link
          href={`/birds/${bird.slug}`}
          className="inline-flex rounded-md border border-(--color-border) bg-(--color-button-background) px-4 py-2 text-sm font-medium text-(--color-text) transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
        >
          Volver a la ficha
        </Link>
      </div>

      <div className="mt-8">
        <PhotoUploadForm birdId={bird.id} birdSlug={bird.slug} />
      </div>
    </section>
  );
}
