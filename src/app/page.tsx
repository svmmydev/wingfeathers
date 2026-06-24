import Image from "next/image";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
      <section className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-(--color-accent)">
            Inicio
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-(--color-text) sm:text-5xl">
            Fotografía, aves y naturaleza
          </h1>

          <div className="mt-6 space-y-5 text-lg leading-8 text-(--color-text-muted)">
            <p>
              WingFeathers es una galería ornitológica dedicada al trabajo
              fotográfico de Rafael Mateos, centrada en aves, naturaleza y
              observación.
            </p>

            <p>
              A través de sus fotografías, esta web recogerá especies
              fotografiadas, información biológica, comportamiento,
              alimentación, hábitat y datos de observación.
            </p>

            <p>
              El objetivo es construir una colección visual y ordenada, donde
              cada ave tenga su propia ficha y sus imágenes asociadas.
            </p>
          </div>
        </div>

        <div className="w-full max-w-xs justify-self-center overflow-hidden rounded-2xl border-2 border-(--color-border) bg-(--color-surface) sm:max-w-sm lg:max-w-none shadow-lg shadow-black/40">
          <Image
            src="/brand/rafael-mateos.jpeg"
            alt="Rafael Mateos"
            width={720}
            height={900}
            priority
            className="aspect-4/5 w-full rounded-2xl"
          />
        </div>
      </section>

      <section>
        <div className="mb-6 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-(--color-accent)">
            Selección fotográfica
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-(--color-text)">
            Imágenes favoritas
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-(--color-text-muted)">
            Aquí mostraremos una selección de fotografías destacadas. Más
            adelante este bloque será un carrusel.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          <div className="aspect-4/3 rounded-2xl border border-dashed border-(--color-border) bg-(--color-surface)" />
          <div className="aspect-4/3 rounded-2xl border border-dashed border-(--color-border) bg-(--color-surface)" />
          <div className="aspect-4/3 rounded-2xl border border-dashed border-(--color-border) bg-(--color-surface)" />
        </div>
      </section>
    </section>
  );
}
