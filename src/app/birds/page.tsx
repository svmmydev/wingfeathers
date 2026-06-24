import Link from "next/link";

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
          Aquí aparecerá el listado de especies fotografiadas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/birds/example-bird"
          className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 transition hover:border-(--color-accent)"
        >
          <h2 className="text-xl font-semibold text-(--color-text)">
            Ave de ejemplo
          </h2>

          <p className="mt-2 text-sm text-(--color-text-muted)">
            Esta tarjeta es temporal para probar la navegación.
          </p>
        </Link>
      </div>
    </section>
  );
}
