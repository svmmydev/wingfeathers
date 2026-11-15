import Link from "next/link";
import { createBird } from "./actions";

type NewBirdPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const inputClassName =
  "mt-2 w-full rounded-xl border border-(--color-border) bg-transparent px-4 py-3 font-normal text-sm text-(--color-text) outline-none transition placeholder:text-(--color-text-muted) placeholder:italic placeholder:opacity-40 focus:border-(--color-border-accent)";

const textareaClassName = `${inputClassName} min-h-32 resize-y`;

const labelClassName = "text-md font-medium text-(--color-text)";

export default async function NewBirdPage({ searchParams }: NewBirdPageProps) {
  const { error } = await searchParams;

  return (
    <section className="mx-auto max-w-5xl px-6 py-12 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-(--color-accent)">
            Panel de administración
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--color-text)">
            Crear ficha de ave
          </h1>

          <p className="mt-2 text-(--color-text-muted)">
            Añade la información principal de una nueva especie.
          </p>
        </div>

        <Link
          href="/birds"
          className="inline-flex rounded-md border border-(--color-border) bg-(--color-button-background) px-4 py-2 text-sm font-medium text-(--color-text) transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
        >
          Volver a aves
        </Link>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-8 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      )}

      <form action={createBird} className="mt-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <label className={labelClassName}>
            Nombre común
            <input
              type="text"
              name="commonName"
              placeholder="Calamón común.."
              required
              className={inputClassName}
            />
          </label>

          <label className={labelClassName}>
            Nombre científico
            <input
              type="text"
              name="scientificName"
              placeholder="Porphyrio porphyrio.."
              required
              className={inputClassName}
            />
          </label>

          <label className={labelClassName}>
            Familia
            <input
              type="text"
              name="family"
              placeholder="Rallidae.."
              required
              className={inputClassName}
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className={labelClassName}>
              Tamaño
              <input
                type="text"
                name="size"
                placeholder="45-50 cm.."
                required
                className={inputClassName}
              />
            </label>

            <label className={labelClassName}>
              Envergadura
              <input
                type="text"
                name="wingspan"
                placeholder="90-110 cm.."
                required
                className={inputClassName}
              />
            </label>
          </div>
        </div>

        <label className="flex justify-center cursor-pointer gap-3 text-sm font-medium text-(--color-text)">
          <input type="checkbox" name="isNative" className="peer sr-only" />
          <span
            aria-hidden="true"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-(--color-border) bg-transparent text-transparent transition peer-checked:border-(--color-border-accent) peer-checked:bg-(--color-button-background) peer-checked:text-(--color-accent) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--color-border-accent)"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 8.5 6.5 12 13 4.5" />
            </svg>
          </span>
          Es una especie autóctona
        </label>

        <div className="grid gap-6">
          <label className={labelClassName}>
            Descripción
            <textarea
              name="description"
              placeholder="Ave acuática de plumaje azul violáceo intenso, pico rojo y patas largas. Suele encontrarse en humedales con abundante vegetación.."
              className={textareaClassName}
            />
          </label>

          <label className={labelClassName}>
            Hábitat
            <textarea
              name="habitat"
              placeholder="Marismas, lagunas, carrizales y zonas húmedas con vegetación densa.."
              className={textareaClassName}
            />
          </label>

          <label className={labelClassName}>
            Alimentación
            <textarea
              name="feeding"
              placeholder="Se alimenta principalmente de brotes, tallos, semillas y vegetación acuática, aunque puede consumir pequeños invertebrados.."
              className={textareaClassName}
            />
          </label>

          <label className={labelClassName}>
            Comportamiento
            <textarea
              name="behavior"
              placeholder="Es un ave visible en bordes de carrizal y zonas abiertas de humedal. Camina entre la vegetación y puede mostrarse territorial.."
              className={textareaClassName}
            />
          </label>

          <label className={labelClassName}>
            Geografía
            <textarea
              name="geography"
              placeholder="Cría en zonas húmedas, construyendo el nido entre vegetación palustre.."
              className={textareaClassName}
            />
          </label>

          <label className={labelClassName}>
            Reproducción
            <textarea
              name="breeding"
              placeholder="Cría en zonas húmedas, construyendo el nido entre vegetación palustre.."
              className={textareaClassName}
            />
          </label>
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-6">
          <Link
            href="/birds"
            className="inline-flex rounded-md border border-(--color-border) px-4 py-2 text-sm font-medium text-(--color-text) transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="inline-flex cursor-pointer rounded-md border border-(--color-border) bg-(--color-button-background) px-4 py-2 text-sm font-medium text-white transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
          >
            Crear ficha
          </button>
        </div>
      </form>
    </section>
  );
}
