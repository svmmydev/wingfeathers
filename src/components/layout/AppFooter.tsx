import Link from "next/link";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-(--color-border)/60 bg-(--color-background)">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 text-sm text-(--color-text-muted) md:flex-row md:items-start md:justify-between md:px-10">
        <div className="max-w-xl">
          <p className="font-medium text-(--color-text)">WingFeathers</p>

          <p className="mt-1">Galería ornitológica de Rafael Mateos.</p>

          <p className="mt-4 leading-6">
            © {currentYear} Rafael Mateos. Todas las fotografías están
            protegidas por derechos de autor. Queda prohibida su reproducción,
            distribución o uso sin consentimiento expreso.
          </p>
        </div>

        <nav className="flex flex-col gap-3 md:items-center">
          <Link href="/" className="transition hover:text-(--color-accent)">
            Inicio
          </Link>

          <Link
            href="/birds"
            className="transition hover:text-(--color-accent)"
          >
            Aves
          </Link>

          <Link
            href="/contact"
            className="transition hover:text-(--color-accent)"
          >
            Contacto
          </Link>
        </nav>
      </div>
    </footer>
  );
}
