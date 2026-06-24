import Image from "next/image";
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="relative z-10 bg-(--color-background) shadow-lg shadow-black/30">
      <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-6 pt-6 pb-8">
        <div className="flex justify-start">
          <span className="text-sm font-medium tracking-wide text-(--color-text-muted)">
            Rafael Mateos
          </span>
        </div>

        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/brand/wingfeathers-logo.png"
              alt="WingFeathers logo"
              width={48}
              height={48}
              priority
            />

            <span className="text-lg font-semibold tracking-wide text-(--color-text)">
              Wing Feathers
            </span>
          </Link>
        </div>

        <div className="flex justify-end">
          <Link
            href="/contact"
            className="rounded-xl border border-(--color-border) px-4 py-2 text-sm font-medium text-(--color-text) transition hover:border-(--color-border-accent) hover:text-(--color--accent)"
          >
            Contacto
          </Link>
        </div>
      </div>

      <div className="border-b border-b-(--color-border)/60 border-t border-t-(--color-border)/60">
        <nav className="mx-auto flex max-w-6xl justify-center gap-10 px-3 py-3 text-sm text-(--color-text-muted)">
          <Link href="/" className="transition hover:text-(--color-text)">
            Inicio
          </Link>

          <Link href="/birds" className="transition hover:text-(--color-text)">
            Aves
          </Link>
        </nav>
      </div>
    </header>
  );
}
