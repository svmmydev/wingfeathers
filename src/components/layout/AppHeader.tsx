import Image from "next/image";
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="relative z-10 w-full overflow-x-clip bg-(--color-background) shadow-lg shadow-black/30">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:grid lg:grid-cols-3 lg:px-10 lg:pt-6 lg:pb-8">
        <div className="hidden justify-start lg:flex">
          <span className="text-sm font-medium tracking-widest text-(--color-text-muted)">
            Rafael Mateos
          </span>
        </div>

        <div className="flex min-w-0 justify-start lg:justify-center">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Image
              src="/brand/wingfeathers-logo.png"
              alt="WingFeathers logo"
              width={48}
              height={49}
              priority
              className="shrink-0"
            />

            <span className="truncate text-lg font-semibold tracking-wider text-(--color-text) sm:text-2xl">
              WingFeathers
            </span>
          </Link>
        </div>

        <div className="flex shrink-0 justify-end">
          <Link
            href="/contact"
            className="rounded-xl border border-(--color-border) bg-(--color-button-background) px-3 py-2 text-sm font-medium shadow-sm shadow-black/25 transition hover:border-(--color-border-accent) hover:text-(--color-accent) sm:px-4"
          >
            Contacto
          </Link>
        </div>
      </div>

      <div className="border-b border-b-(--color-border)/60 border-t border-t-(--color-border)/60">
        <nav className="mx-auto flex max-w-6xl justify-center gap-8 px-4 py-3 text-base tracking-wider text-(--color-text-muted) sm:gap-10">
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
