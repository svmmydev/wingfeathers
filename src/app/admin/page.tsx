import { logout } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";
import { getR2StorageUsage } from "@/lib/r2";

const STORAGE_REFERENCE_BYTES = 10_000_000_000;

export default async function AdminPage() {
  const supabase = await createClient();

  const { count: photoCount, error: countError } = await supabase
    .from("photos")
    .select("id", { count: "exact", head: true });

  if (countError) {
    throw new Error(countError.message);
  }

  const { usedBytes } = await getR2StorageUsage();
  //const usedBytes = 0;

  const usedGB = usedBytes / 1_000_000_000;
  const percentage = (usedBytes / STORAGE_REFERENCE_BYTES) * 100;
  const remainingGB =
    Math.max(0, STORAGE_REFERENCE_BYTES - usedBytes) / 1_000_000_000;

  const barColor =
    percentage >= 95
      ? "bg-red-500"
      : percentage >= 85
        ? "bg-orange-500"
        : percentage >= 70
          ? "bg-yellow-500"
          : "bg-emerald-500";

  const formatNumber = (value: number) =>
    value.toLocaleString("es-ES", {
      maximumFractionDigits: 2,
    });

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-6 rounded-2xl border-2 border-(--color-border)/60 bg-(--color-surface) p-6 shadow-lg shadow-black/30 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Panel admin</h1>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="cursor-pointer rounded-md border border-(--color-border) bg-black/30 px-4 py-2 text-sm font-medium text-white transition hover:border-(--color-border-accent)"
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      <div className="mt-8 rounded-2xl border-2 border-(--color-border)/60 bg-(--color-surface) p-6 shadow-lg shadow-black/30">
        <h2 className="text-lg font-semibold text-(--color-text)">
          Almacenamiento de fotografías
        </h2>

        <p className="mt-2 text-sm text-(--color-text-muted)">
          Espacio utilizado por las imágenes almacenadas en Cloudflare R2.
        </p>

        <div className="mt-6 flex flex-wrap items-baseline gap-2">
          <span className="text-3xl font-semibold text-(--color-text)">
            {formatNumber(usedGB)} GB
          </span>

          <span className="text-sm text-(--color-text-muted)">
            de 10 GB de referencia
          </span>
        </div>

        <div
          role="progressbar"
          aria-label="Almacenamiento utilizado"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(100, percentage)}
          className="mt-5 h-3 overflow-hidden rounded-full bg-white/10"
        >
          <div
            className={`h-full rounded-full ${barColor}`}
            style={{
              width: `${Math.min(100, percentage)}%`,
            }}
          />
        </div>

        <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-(--color-text-muted)">
          <span>{formatNumber(percentage)} % utilizado</span>
          <span>{formatNumber(remainingGB)} GB disponibles estimados</span>
        </div>

        <div className="mt-6 border-t border-(--color-border)/60 pt-5">
          <p className="text-sm text-(--color-text-muted)">
            Fotografías registradas
          </p>

          <p className="mt-1 text-2xl font-semibold text-(--color-text)">
            {photoCount ?? 0}
          </p>
        </div>

        {percentage >= 70 && (
          <p className="mt-5 text-sm text-(--color-text-muted)">
            {percentage >= 95
              ? "Almacenamiento próximo al límite de referencia."
              : percentage >= 85
                ? "El almacenamiento está alcanzando un nivel elevado."
                : "El almacenamiento ha superado el 70 % de la referencia."}
          </p>
        )}
      </div>
    </section>
  );
}
