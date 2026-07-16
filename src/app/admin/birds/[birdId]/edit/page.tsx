import Link from "next/link";
import { notFound } from "next/navigation";
import { getBirdById } from "@/lib/birds";
import { updateBird } from "./actions";

type EditBirdPageProps = {
  params: Promise<{
    birdId: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

const inputClassName =
  "mt-2 w-full rounded-xl border border-(--color-border) bg-transparent px-4 py-3 text-(--color-text) outline-none transition placeholder:text-(--color-text-muted) focus:border-(--color-border-accent)";

const textareaClassName = `${inputClassName} min-h-32 resize-y`;

export default async function EditBirdPage({
  params,
  searchParams,
}: EditBirdPageProps) {
  const [{ birdId }, { error }] = await Promise.all([params, searchParams]);

  const bird = await getBirdById(birdId);

  if (!bird) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-(--color-accent)">
            Panel de administración
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--color-text)">
            Editar {bird.commonName}
          </h1>

          <p className="mt-2 italic text-(--color-text-muted)">
            {bird.scientificName}
          </p>
        </div>

        <Link
          href={`/birds/${bird.slug}`}
          className="inline-flex rounded-md border border-(--color-border) bg-(--color-button-background) px-4 py-2 text-sm font-medium text-(--color-text) transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
        >
          Volver a la ficha
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

      <form action={updateBird} className="mt-8 space-y-8">
        <input type="hidden" name="birdId" value={bird.id} />
        <input type="hidden" name="originalSlug" value={bird.slug} />

        <div className="grid gap-6 md:grid-cols-2">
          <label className="text-sm font-medium text-(--color-text)">
            Nombre común
            <input
              type="text"
              name="commonName"
              defaultValue={bird.commonName}
              required
              className={inputClassName}
            />
          </label>

          <label className="text-sm font-medium text-(--color-text)">
            Nombre científico
            <input
              type="text"
              name="scientificName"
              defaultValue={bird.scientificName}
              required
              className={`${inputClassName} italic`}
            />
          </label>

          <label className="text-sm font-medium text-(--color-text)">
            Familia
            <input
              type="text"
              name="family"
              defaultValue={bird.family}
              required
              className={inputClassName}
            />
          </label>

          <label className="text-sm font-medium text-(--color-text)">
            Tamaño
            <input
              type="text"
              name="size"
              defaultValue={bird.size}
              className={inputClassName}
            />
          </label>
        </div>

        <label className="flex w-fit items-center gap-3 text-sm font-medium text-(--color-text)">
          <input
            type="checkbox"
            name="isNative"
            defaultChecked={bird.isNative}
            className="h-4 w-4 accent-(--color-accent)"
          />
          Es una especie autóctona
        </label>

        <div className="grid gap-6">
          <label className="text-sm font-medium text-(--color-text)">
            Descripción
            <textarea
              name="description"
              defaultValue={bird.description}
              className={textareaClassName}
            />
          </label>

          <label className="text-sm font-medium text-(--color-text)">
            Hábitat
            <textarea
              name="habitat"
              defaultValue={bird.habitat}
              className={textareaClassName}
            />
          </label>

          <label className="text-sm font-medium text-(--color-text)">
            Alimentación
            <textarea
              name="feeding"
              defaultValue={bird.feeding}
              className={textareaClassName}
            />
          </label>

          <label className="text-sm font-medium text-(--color-text)">
            Comportamiento
            <textarea
              name="behavior"
              defaultValue={bird.behavior}
              className={textareaClassName}
            />
          </label>

          <label className="text-sm font-medium text-(--color-text)">
            Geografía
            <textarea
              name="geography"
              defaultValue={bird.geography}
              className={textareaClassName}
            />
          </label>

          <label className="text-sm font-medium text-(--color-text)">
            Reproducción
            <textarea
              name="breeding"
              defaultValue={bird.breeding}
              className={textareaClassName}
            />
          </label>
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-6">
          <Link
            href={`/birds/${bird.slug}`}
            className="inline-flex rounded-md border border-(--color-border) px-4 py-2 text-sm font-medium text-(--color-text) transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="cursor-pointer inline-flex rounded-md border border-(--color-border) bg-(--color-button-background) px-4 py-2 text-sm font-medium text-white transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </section>
  );
}
