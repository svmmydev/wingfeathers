import { logout } from "@/app/login/actions";

export default async function AdminPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-6 rounded-2xl border-2 border-(--color-border)/60 bg-(--color-surface) p-6 shadow-lg shadow-black/30 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Panel admin</h1>

          <p className="mt-2 text-sm text-(--color-text-muted)">
            Zona privada para gestionar aves, fotografías y contenido.
          </p>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="cursor-pointer rounded-md border border-(--color-border) bg-black/30 px-4 py-2 text-sm font-medium text-white transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="border border-(--color-border)/60 bg-black/20 p-5">
          <h2 className="font-semibold text-white">Aves</h2>
          <p className="mt-2 text-sm text-(--color-text-muted)">
            Próximamente: crear y editar fichas.
          </p>
        </div>

        <div className="border border-(--color-border)/60 bg-black/20 p-5">
          <h2 className="font-semibold text-white">Fotos</h2>
          <p className="mt-2 text-sm text-(--color-text-muted)">
            Próximamente: subir imágenes y generar variantes.
          </p>
        </div>

        <div className="border border-(--color-border)/60 bg-black/20 p-5">
          <h2 className="font-semibold text-white">Almacenamiento</h2>
          <p className="mt-2 text-sm text-(--color-text-muted)">
            Próximamente: uso estimado de Cloudflare R2.
          </p>
        </div>
      </div>
    </section>
  );
}
