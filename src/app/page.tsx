export default function Home() {
  return (
    <main className="min-h-screen bg-(--color-background) text-(--color-text)">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-(--color-brand-soft)">
          WingFeathers
        </p>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">
          App Ornitología
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-(--color-text-muted)">
          Una web para documentar aves, fotografías, datos biológicos y
          observaciones de campo.
        </p>
      </section>
    </main>
  );
}
