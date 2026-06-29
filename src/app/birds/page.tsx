import { birds } from "@/data/birds";
import { BirdsGrid } from "@/components/birds/BirdsGrid";

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
          Consulta las especies fotografiadas y accede a sus fichas con
          información biológica, comportamiento, alimentación, hábitat y galería
          asociada.
        </p>
      </div>

      <BirdsGrid birds={birds} />
    </section>
  );
}
