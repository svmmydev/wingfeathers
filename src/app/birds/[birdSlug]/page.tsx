type BirdDetailPageProps = {
  params: {
    birdSlug: string;
  };
};

export default function BirdDetailPage({ params }: BirdDetailPageProps) {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1fr_320px]">
      <div>
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-(--color-accent)">
          Ficha de ave
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-(--color-text)">
          {params.birdSlug}
        </h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="aspect-4/3 rounded-2xl border border-(--color-border) bg-(--color-surface)" />
          <div className="aspect-4/3 rounded-2xl border border-(--color-border) bg-(--color-surface)" />
          <div className="aspect-4/3 rounded-2xl border border-(--color-border) bg-(--color-surface)" />
          <div className="aspect-4/3 rounded-2xl border border-(--color-border) bg-(--color-surface)" />
        </div>
      </div>

      <aside className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6">
        <h2 className="text-xl font-semibold text-(--color-text)">
          Información del ave
        </h2>

        <p className="mt-4 text-sm leading-6 text-(--color-text-muted)">
          Aquí mostraremos nombre común, nombre científico, alimentación,
          comportamiento, hábitat, dimensiones, época del año y datos de
          observación.
        </p>
      </aside>
    </section>
  );
}
