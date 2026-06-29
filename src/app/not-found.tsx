import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-8 py-16 text-center">
      <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-(--color-accent)">
        Página no encontrada
      </p>

      <h1 className="text-4xl font-semibold tracking-tight text-(--color-text) sm:text-5xl">
        No hemos encontrado esta ruta
      </h1>

      <p className="mt-5 max-w-2xl text-lg leading-8 text-(--color-text-muted)">
        Puede que la página no exista, que la especie todavía no esté añadida o
        que el enlace haya cambiado.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-xl border border-(--color-border) bg-(--color-button-background) px-5 py-3 text-sm font-medium text-(--color-text) transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
        >
          Volver al inicio
        </Link>

        <Link
          href="/birds"
          className="rounded-xl border border-(--color-border) bg-(--color-button-background) px-5 py-3 text-sm font-medium text-(--color-text) transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
        >
          Ver aves
        </Link>
      </div>
    </section>
  );
}
