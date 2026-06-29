import { notFound } from "next/navigation";
import { PhotoGallery } from "@/components/gallery/PhotoGallery";
import { birds } from "@/data/birds";

type BirdDetailPageProps = {
  params: Promise<{
    birdSlug: string;
  }>;
};

export default async function BirdDetailPage({ params }: BirdDetailPageProps) {
  const { birdSlug } = await params;

  const bird = birds.find((currentBird) => currentBird.slug === birdSlug);

  if (!bird) {
    notFound();
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-8 py-16 lg:grid-cols-[1fr_340px]">
      <div>
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-(--color-accent)">
          Ficha de ave
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-(--color-text)">
          {bird.commonName}
        </h1>

        <p className="mt-2 text-lg italic text-(--color-text-muted)">
          {bird.scientificName}
        </p>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-(--color-text-muted)">
          {bird.description}
        </p>

        <div className="mt-8">
          <PhotoGallery photos={bird.photos} />
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-lg shadow-black/25">
        <h2 className="text-xl font-semibold text-(--color-text)">
          Información del ave
        </h2>

        <dl className="mt-5 space-y-5 text-sm leading-6">
          <div>
            <dt className="font-semibold text-(--color-text)">Familia</dt>
            <dd className="mt-1 text-(--color-text-muted)">{bird.family}</dd>
          </div>

          <div>
            <dt className="font-semibold text-(--color-text)">Tamaño</dt>
            <dd className="mt-1 text-(--color-text-muted)">{bird.size}</dd>
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
            <dt className="font-semibold text-(--color-text)">Época del año</dt>
            <dd className="mt-1 text-(--color-text-muted)">
              {bird.seasonality}
            </dd>
          </div>
        </dl>
      </aside>
    </section>
  );
}
