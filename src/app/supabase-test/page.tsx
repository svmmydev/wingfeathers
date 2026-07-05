import { createClient } from "@/lib/supabase/server";

export default async function SupabaseTestPage() {
  const supabase = await createClient();

  const { data: birds, error } = await supabase
    .from("birds")
    .select("id, slug, common_name, scientific_name, family")
    .order("common_name", { ascending: true });

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Error de Supabase</h1>
        <pre className="mt-6 whitespace-pre-wrap rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-100">
          {error.message}
        </pre>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Supabase conectado</h1>

      <pre className="mt-6 overflow-auto rounded-xl border border-(--color-border) bg-(--color-surface) p-4 text-sm">
        {JSON.stringify(birds, null, 2)}
      </pre>
    </main>
  );
}
