"use client";

import { useEffect, useState } from "react";
import { deleteBird } from "./actions";

type DeleteBirdButtonProps = {
  birdId: string;
  birdSlug: string;
  birdName: string;
};

export function DeleteBirdButton({
  birdId,
  birdSlug,
  birdName,
}: DeleteBirdButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeWithEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [isModalOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="inline-flex cursor-pointer rounded-md border border-red-900 bg-red-950/40 px-4 py-2 text-sm font-medium text-red-200 transition hover:border-red-700 hover:bg-red-950/70"
      >
        Eliminar ficha
      </button>

      {isModalOpen && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsModalOpen(false);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-bird-title"
            aria-describedby="delete-bird-description"
            className="w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-2xl shadow-black/50"
          >
            <h2
              id="delete-bird-title"
              className="text-xl font-semibold text-(--color-text)"
            >
              Eliminar ficha
            </h2>

            <p
              id="delete-bird-description"
              className="mt-3 leading-7 text-(--color-text-muted)"
            >
              ¿Seguro que quieres eliminar la ficha de{" "}
              <strong className="font-semibold text-(--color-text)">
                {birdName}
              </strong>
              ?
            </p>

            <p className="mt-2 text-sm text-red-300">
              Esta acción es permanente y no se puede deshacer.
            </p>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                autoFocus
                onClick={() => setIsModalOpen(false)}
                className="inline-flex cursor-pointer rounded-md border border-(--color-border) px-4 py-2 text-sm font-medium text-(--color-text) transition hover:border-(--color-border-accent) hover:text-(--color-accent)"
              >
                Cancelar
              </button>

              <form action={deleteBird}>
                <input type="hidden" name="birdId" value={birdId} />
                <input type="hidden" name="birdSlug" value={birdSlug} />

                <button
                  type="submit"
                  className="inline-flex cursor-pointer rounded-md border border-red-800 bg-red-950/60 px-4 py-2 text-sm font-medium text-red-200 transition hover:border-red-600 hover:bg-red-950"
                >
                  Sí, eliminar ficha
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
