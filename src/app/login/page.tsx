import { login } from "@/app/login/actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <section className="mx-auto flex min-h-[70svh] max-w-md flex-col justify-center px-6 py-16">
      <div className="border-2 border-(--color-border)/60 bg-(--color-surface) p-6 shadow-lg shadow-black/30">
        <h1 className="text-2xl font-semibold text-white">Acceso admin</h1>

        <p className="mt-3 text-sm leading-6 text-(--color-text-muted)">
          Inicia sesión para gestionar el contenido privado de WingFeathers.
        </p>

        {error && (
          <p className="mt-4 border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
            {error === "missing-fields"
              ? "Introduce email y contraseña."
              : "Credenciales incorrectas."}
          </p>
        )}

        <form action={login} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 w-full border border-(--color-border) bg-black/30 px-3 py-2 text-white outline-none transition focus:border-(--color-border-accent)"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Contraseña
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 w-full border border-(--color-border) bg-black/30 px-3 py-2 text-white outline-none transition focus:border-(--color-border-accent)"
            />
          </div>

          <button
            type="submit"
            className="w-full border border-(--color-border) bg-(--color-button-background) px-4 py-2 text-sm font-medium text-white transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
          >
            Entrar
          </button>
        </form>
      </div>
    </section>
  );
}
