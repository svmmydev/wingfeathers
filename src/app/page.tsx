export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-(--color-accent)">
          Inicio
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-(--color-text)">
          Fotografía, aves y naturaleza
        </h1>

        <p className="mt-4 text-lg leading-8 text-(--color-text-muted)">
          WingFeathers será una galería ornitológica dedicada al trabajo
          fotográfico de Rafael Mateos, con fichas de aves, imágenes y datos de
          observación.
        </p>
      </div>
    </section>
  );
}
