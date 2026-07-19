import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoGallery } from "@/components/gallery/PhotoGallery";
import { getBirdBySlug } from "@/lib/birds";
import { isAuthenticated } from "@/lib/auth";

type BirdDetailPageProps = {
  params: Promise<{
    birdSlug: string;
  }>;
};

export default async function BirdDetailPage({ params }: BirdDetailPageProps) {
  const { birdSlug } = await params;

  const [bird, isAdmin] = await Promise.all([
    getBirdBySlug(birdSlug),
    isAuthenticated(),
  ]);

  if (!bird) {
    notFound();
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-8 py-16 lg:grid-cols-[1fr_340px]">
      <div>
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-(--color-accent)">
          Ficha de ave
        </p>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-(--color-text)">
              {bird.commonName}
            </h1>

            <p className="mt-2 text-lg italic text-(--color-text-muted)">
              {bird.scientificName}
            </p>
          </div>

          {isAdmin && (
            <Link
              href={`/admin/birds/${bird.id}/edit`}
              className="inline-flex shrink-0 gap-2 rounded-md border border-(--color-border) bg-(--color-button-background) px-4 py-2 text-sm font-medium text-white transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
            >
              <span aria-hidden="true">✎</span>
              Editar
            </Link>
          )}
        </div>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-(--color-text-muted)">
          {bird.description}
        </p>

        {bird.photos.length > 0 ? (
          <div className="mt-8">
            <PhotoGallery
              photos={bird.photos}
              showPhotoInfo
              birdCommonName={bird.commonName}
              birdScientificName={bird.scientificName}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center mt-16 px-6 text-center">
            <p className="text-sm italic text-(--color-text-muted)">
              Esta ficha todavía no tiene fotografías.
            </p>
          </div>
        )}
      </div>

      <aside className="h-fit rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-lg shadow-black/25">
        <h2 className="text-xl font-semibold text-(--color-text)">
          Información del ave
        </h2>

        <dl className="mt-5 space-y-5 text-sm leading-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <dt className="font-semibold text-(--color-text)">Familia</dt>
              <dd className="mt-1 text-(--color-text-muted)">{bird.family}</dd>
            </div>
            <div>
              <dt className="font-semibold text-(--color-text)">Tamaño</dt>
              <dd className="mt-1 text-(--color-text-muted)">{bird.size}</dd>
            </div>
          </div>

          <div>
            <dt className="font-semibold text-(--color-text)">Hábitat</dt>
            <dd className="mt-1 text-(--color-text-muted)">{bird.habitat}</dd>
          </div>

          <div>
            <dt className="font-semibold text-(--color-text)">Alimentación</dt>
            <dd className="mt-1 text-(--color-text-muted)">{bird.feeding}</dd>
          </div>

          <div>
            <dt className="font-semibold text-(--color-text)">
              Comportamiento
            </dt>
            <dd className="mt-1 text-(--color-text-muted)">{bird.behavior}</dd>
          </div>

          <div>
            <dt className="font-semibold text-(--color-text)">Reproducción</dt>
            <dd className="mt-1 text-(--color-text-muted)">{bird.breeding}</dd>
          </div>

          <div>
            <dt className="font-semibold text-(--color-text)">Geografía</dt>
            {/*TODO: Implementar la info de geography en los campos existentes de la base de datos*/}
            <dd className="mt-1 text-(--color-text-muted)">{bird.geography}</dd>
          </div>
        </dl>
      </aside>
    </section>
  );
}
