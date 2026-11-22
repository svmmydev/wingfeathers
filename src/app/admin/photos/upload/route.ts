import { createClient } from "@/lib/supabase/server";
import { uploadToR2 } from "@/lib/r2";
import { MAX_WEBP_VARIANT_SIZE } from "@/lib/constants";

export const runtime = "nodejs";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PUT(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;

  const birdId = params.get("birdId");
  const photoId = params.get("photoId");
  const variant = params.get("variant");

  if (
    !birdId ||
    !photoId ||
    !UUID_REGEX.test(birdId) ||
    !UUID_REGEX.test(photoId) ||
    (variant !== "card" && variant !== "large")
  ) {
    return Response.json(
      { error: "Datos de subida no válidos." },
      { status: 400 },
    );
  }

  if (request.headers.get("content-type") !== "image/webp") {
    return Response.json(
      { error: "Solo se admiten imágenes WebP." },
      { status: 415 },
    );
  }

  const declaredSize = Number(request.headers.get("content-length") ?? 0);

  if (declaredSize > MAX_WEBP_VARIANT_SIZE) {
    return Response.json(
      { error: "La imagen supera los 4 MiB permitidos." },
      { status: 413 },
    );
  }

  try {
    const data = new Uint8Array(await request.arrayBuffer());

    if (data.byteLength === 0 || data.byteLength > MAX_WEBP_VARIANT_SIZE) {
      return Response.json(
        { error: "La imagen está vacía o supera los 4 MiB permitidos." },
        { status: 413 },
      );
    }

    const key = `birds/${birdId}/${photoId}/${variant}.webp`;

    await uploadToR2(key, data);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error uploading image to R2:", error);

    return Response.json(
      { error: "No se ha podido almacenar la imagen en R2." },
      { status: 500 },
    );
  }
}
