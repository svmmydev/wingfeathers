import { BirdsGrid } from "@/components/birds/BirdsGrid";
import { getBirds } from "@/lib/birds";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";

export default async function BirdsPage() {
  const [birds, isAdmin] = await Promise.all([getBirds(), isAuthenticated()]);

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-8 py-16">
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

        {isAdmin && (
          <div className="mt-4">
            <Link
              href="/admin/birds/new"
              className="inline-flex rounded-md border border-(--color-border) bg-(--color-button-background) px-4 py-2 text-sm font-medium text-white transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
            >
              Crear ficha
            </Link>
          </div>
        )}
      </div>

      <BirdsGrid birds={birds} />
    </section>
  );
}
