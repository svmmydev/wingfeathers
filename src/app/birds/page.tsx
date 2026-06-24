import Image from "next/image";
import Link from "next/link";
import { birds } from "@/data/birds";

export default function BirdsPage() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-8 py-16">
      <div>
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-(--color-accent)">
          Aves
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-(--color-text)">
          Aves fotografiadas
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-(--color-text-muted)">
          Consulta las especies fotografiadas y accede a sus fichas con
          información biológica, comportamiento, alimentación, hábitat y galería
          asociada.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {birds.map((bird) => {
          const coverPhoto = bird.photos[0];

          return (
            <Link
              key={bird.id}
              href={`/birds/${bird.slug}`}
              className="group overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-lg shadow-black/25 transition hover:border-(--color-border-accent)"
            >
              <Image
                src={coverPhoto.src}
                alt={coverPhoto.alt}
                width={400}
                height={300}
                className="aspect-4/3 w-full object-cover"
              />

              <div className="p-3">
                <h2 className="text-xl font-semibold text-(--color-text)">
                  {bird.commonName}
                </h2>

                <p className="mt-1 text-sm italic text-(--color-text-muted)">
                  {bird.scientificName}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
