"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSlug } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";

function getFormValue(formData: FormData, fieldName: string): string {
  return String(formData.get(fieldName) ?? "").trim();
}

function redirectToNewWithError(message: string): never {
  const encodedMessage = encodeURIComponent(message);

  redirect(`/admin/birds/new?error=${encodedMessage}`);
}

export async function createBird(formData: FormData): Promise<void> {
  const commonName = getFormValue(formData, "commonName");
  const scientificName = getFormValue(formData, "scientificName");
  const family = getFormValue(formData, "family");
  const size = getFormValue(formData, "size");
  const description = getFormValue(formData, "description");
  const habitat = getFormValue(formData, "habitat");
  const feeding = getFormValue(formData, "feeding");
  const behavior = getFormValue(formData, "behavior");
  const geography = getFormValue(formData, "geography");
  const breeding = getFormValue(formData, "breeding");
  const isNative = formData.get("isNative") === "on";

  if (!commonName || !scientificName || !family) {
    redirectToNewWithError(
      "El nombre común, el nombre científico y la familia son obligatorios.",
    );
  }

  const slug = createSlug(commonName);

  if (!slug) {
    redirectToNewWithError(
      "El nombre común debe contener al menos una letra o un número.",
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("birds")
    .insert({
      slug,
      common_name: commonName,
      scientific_name: scientificName,
      family,
      is_native: isNative,
      geography,
      description,
      habitat,
      feeding,
      behavior,
      breeding,
      size,
    })
    .select("slug")
    .maybeSingle();

  if (error) {
    console.error("Error creating bird:", error);

    const message =
      error.code === "23505"
        ? "Ya existe otra ave con ese nombre común."
        : "No se ha podido crear la ficha.";

    redirectToNewWithError(message);
  }

  if (!data) {
    redirectToNewWithError("No se ha podido crear la ficha.");
  }

  revalidatePath("/birds");

  redirect(`/birds/${data.slug}`);
}
