export default function ContactPage() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-8 py-16">
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-(--color-accent)">
          Contacto
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-(--color-text)">
          Contacto y uso de fotografías
        </h1>

        <p className="mt-4 text-lg leading-8 text-(--color-text-muted)">
          Para consultas relacionadas con las fotografías, especies publicadas o
          solicitudes de uso del material visual, se podrá contactar con el
          autor de la galería.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-lg shadow-black/25">
          <h2 className="text-xl font-semibold text-(--color-text)">
            Solicitud de uso
          </h2>

          <p className="mt-3 text-sm leading-7 text-(--color-text-muted)">
            Las fotografías publicadas en WingFeathers pertenecen a Rafael
            Mateos. Cualquier uso, reproducción, distribución o publicación del
            material requiere consentimiento expreso previo.
          </p>
        </article>

        <article className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-lg shadow-black/25">
          <h2 className="text-xl font-semibold text-(--color-text)">
            Información pendiente
          </h2>

          <p className="mt-3 text-sm leading-7 text-(--color-text-muted)">
            Más adelante se añadirá una dirección de contacto o un formulario
            sencillo para gestionar consultas y solicitudes relacionadas con la
            galería.
          </p>
        </article>
      </div>
    </section>
  );
}
