import Image from "next/image";

const homePhotos = [
  {
    id: "bird-01",
    src: "/gallery/calamon.jpg",
    alt: "Fotografía de ave 1",
  },
  {
    id: "bird-02",
    src: "/gallery/garcilla-cangrejera.jpg",
    alt: "Fotografía de ave 2",
  },
  {
    id: "bird-03",
    src: "/gallery/zampullin-chico.jpg",
    alt: "Fotografía de ave 3",
  },
  {
    id: "bird-04",
    src: "/gallery/calamon.jpg",
    alt: "Fotografía de ave 4",
  },
  {
    id: "bird-05",
    src: "/gallery/garcilla-cangrejera.jpg",
    alt: "Fotografía de ave 5",
  },
  {
    id: "bird-06",
    src: "/gallery/zampullin-chico.jpg",
    alt: "Fotografía de ave 6",
  },
  {
    id: "bird-07",
    src: "/gallery/calamon.jpg",
    alt: "Fotografía de ave 6",
  },
  {
    id: "bird-08",
    src: "/gallery/garcilla-cangrejera.jpg",
    alt: "Fotografía de ave 6",
  },
];

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

        <div className="w-full max-w-xs justify-self-center overflow-hidden rounded-2xl border-2 border-(--color-border)/60 sm:max-w-sm lg:max-w-none shadow-lg shadow-black/40">
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
            Galería fotográfica
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-(--color-text)">
            Fotografías de Rafael Mateos
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homePhotos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              className="group overflow-hidden rounded-2xl border-2 border-(--color-border)/60 shadow-lg shadow-black/30 transition hover:border-(--color-border-accent) hover:shadow-black/50"
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
      </section>
    </section>
  );
}
