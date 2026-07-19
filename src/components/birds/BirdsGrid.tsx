"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Bird } from "@/types/birds";

type BirdsGridProps = {
  birds: Bird[];
};

function normalizeSearchValue(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function BirdsGrid({ birds }: BirdsGridProps) {
  const [searchValue, setSearchValue] = useState("");

  const filteredBirds = useMemo(() => {
    const normalizedSearchValue = normalizeSearchValue(searchValue.trim());

    if (!normalizedSearchValue) {
      return birds;
    }

    return birds.filter((bird) => {
      const searchableValue = normalizeSearchValue(
        `${bird.commonName} ${bird.scientificName} ${bird.family}`,
      );

      return searchableValue.includes(normalizedSearchValue);
    });
  }, [birds, searchValue]);

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-md">
        <label
          htmlFor="bird-search"
          className="mb-2 block text-sm font-medium text-(--color-text-muted)"
        >
          Buscar ave
        </label>

        <input
          id="bird-search"
          type="search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Nombre común, científico o familia"
          className="w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-sm text-(--color-text) outline-none transition placeholder:text-(--color-text-muted) focus:border-(--color-border-accent)"
        />
      </div>

      {filteredBirds.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredBirds.map((bird) => {
            const coverPhoto = bird.photos[0];

            return (
              <Link
                key={bird.id}
                href={`/birds/${bird.slug}`}
                className="group overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-lg shadow-black/25 transition hover:border-(--color-border-accent)"
              >
                <div className="aspect-4/3 overflow-hidden bg-(--color-background-body)">
                  {coverPhoto ? (
                    <Image
                      src={coverPhoto.src}
                      alt={coverPhoto.alt}
                      width={400}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-sm italic text-(--color-text-muted)">
                      Sin fotografías
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h2 className="text-xl font-semibold text-(--color-text)">
                    {bird.commonName}
                  </h2>

                  <p className="mt-1 text-sm italic text-(--color-text-muted)">
                    {bird.scientificName}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-sm text-(--color-text-muted)">
          No se han encontrado aves con ese criterio.
        </div>
      )}
    </div>
  );
}
