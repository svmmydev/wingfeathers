"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createSlug } from "@/lib/slug";

function getFormValue(formData: FormData, fieldName: string): string {
  return String(formData.get(fieldName) ?? "").trim();
}

function redirectToEditWithError(birdId: string, message: string): never {
  const encodedBirdId = encodeURIComponent(birdId);
  const encodedMessage = encodeURIComponent(message);

  redirect(`/admin/birds/${encodedBirdId}/edit?error=${encodedMessage}`);
}

export async function updateBird(formData: FormData): Promise<void> {
  const birdId = getFormValue(formData, "birdId");
  const originalSlug = getFormValue(formData, "originalSlug");

  if (!birdId) {
    redirect("/birds");
  }

  const commonName = getFormValue(formData, "commonName");
  const slug = createSlug(commonName);
  const scientificName = getFormValue(formData, "scientificName");
  const family = getFormValue(formData, "family");
  const geography = getFormValue(formData, "geography");
  const description = getFormValue(formData, "description");
  const habitat = getFormValue(formData, "habitat");
  const feeding = getFormValue(formData, "feeding");
  const behavior = getFormValue(formData, "behavior");
  const breeding = getFormValue(formData, "breeding");
  const size = getFormValue(formData, "size");
  const isNative = formData.get("isNative") === "on";

  if (!commonName || !scientificName || !family) {
    redirectToEditWithError(
      birdId,
      "El slug, el nombre común, el nombre científico y la familia son obligatorios.",
    );
  }

  if (!slug) {
    redirectToEditWithError(
      birdId,
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
    .update({
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
    .eq("id", birdId)
    .select("slug")
    .maybeSingle();

  if (error) {
    console.error("Error updating bird:", error);

    const message =
      error.code === "23505"
        ? "Ya existe otra ave con ese nombre común."
        : "No se ha podido guardar el ave.";

    redirectToEditWithError(birdId, message);
  }

  if (!data) {
    redirectToEditWithError(birdId, "No se ha encontrado el ave.");
  }

  revalidatePath("/");
  revalidatePath("/birds");
  revalidatePath(`/birds/${originalSlug}`);
  revalidatePath(`/birds/${data.slug}`);

  redirect(`/birds/${data.slug}`);
}

export async function deleteBird(formData: FormData): Promise<void> {
  const birdId = getFormValue(formData, "birdId");
  const birdSlug = getFormValue(formData, "birdSlug");

  if (!birdId) {
    redirect("/birds");
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
    .delete()
    .eq("id", birdId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Error deleting bird:", error);

    redirectToEditWithError(birdId, "No se ha podido eliminar la ficha.");
  }

  if (!data) {
    redirectToEditWithError(
      birdId,
      "No se ha encontrado la ficha que intentabas eliminar.",
    );
  }

  revalidatePath("/");
  revalidatePath("/birds");

  if (birdSlug) {
    revalidatePath(`/birds/${birdSlug}`);
  }

  redirect("/birds");
}
