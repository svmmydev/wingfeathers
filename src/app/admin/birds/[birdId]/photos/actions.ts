"use server";

import { revalidatePath } from "next/cache";
import { getBirdById } from "@/lib/birds";
import { deleteFromR2 } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";

export async function deleteBirdPhotos(birdId: string, photoIds: string[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autorizado.");
  }

  const bird = await getBirdById(birdId);

  if (!bird) {
    throw new Error("El ave no existe.");
  }

  const uniqueIds = [...new Set(photoIds)];

  if (uniqueIds.length === 0) {
    throw new Error("No hay fotografías seleccionadas.");
  }

  const { data: photos, error: photosError } = await supabase
    .from("photos")
    .select("id, photo_variants(storage_path, format)")
    .eq("bird_id", birdId)
    .in("id", uniqueIds);

  if (photosError || !photos || photos.length !== uniqueIds.length) {
    throw new Error("No se han podido localizar las fotografías.");
  }

  const deletedIds: string[] = [];
  const failedIds: string[] = [];

  for (const photo of photos) {
    try {
      for (const variant of photo.photo_variants) {
        if (variant.format !== "webp") continue;

        if (!variant.storage_path.startsWith(`birds/${birdId}/${photo.id}/`)) {
          throw new Error("Ruta de almacenamiento no válida.");
        }

        await deleteFromR2(variant.storage_path);
      }

      const { data, error } = await supabase
        .from("photos")
        .delete()
        .eq("id", photo.id)
        .eq("bird_id", birdId)
        .select("id")
        .single();

      if (error || !data) {
        throw new Error("No se ha podido eliminar de Supabase.");
      }

      deletedIds.push(photo.id);
    } catch (error) {
      console.error(`Error deleting photo ${photo.id}:`, error);
      failedIds.push(photo.id);
    }
  }

  if (deletedIds.length > 0) {
    revalidatePath("/");
    revalidatePath("/birds");
    revalidatePath(`/birds/${bird.slug}`);
  }

  return { deletedIds, failedIds };
}
