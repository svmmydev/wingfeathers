import Image from "next/image";
import { homePhotos } from "@/data/home-photos";
import { PhotoGallery } from "@/components/gallery/PhotoGallery";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-8 py-16">
      <section className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center mb-6">
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em]">
            Biografía
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
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

        <div className="w-full max-w-xs justify-self-center overflow-hidden border-2 border-(--color-border)/60 sm:max-w-sm lg:max-w-none shadow-lg shadow-black/60">
          <Image
            src="/brand/rafael-mateos.jpeg"
            alt="Rafael Mateos"
            width={720}
            height={900}
            priority
            className="aspect-4/5 w-full"
          />
        </div>
      </section>

      <section>
        <div className="mb-6 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em]">
            Galería
          </p>

          <h2 className="text-3xl font-semibold tracking-tight mb-12">
            Fotografías de Rafael Mateos
          </h2>
        </div>

        <PhotoGallery photos={homePhotos} showPhotoInfo showBirdLink />
      </section>
    </section>
  );
}
