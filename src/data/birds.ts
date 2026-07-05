export type BirdPhoto = {
  id: string;
  src: string;
  alt: string;
  uploadedAt: string;
  title?: string;
  camera?: string;
  lens?: string;
};

export type Bird = {
  id: string;
  slug: string;
  commonName: string;
  scientificName: string;
  family: string;
  isNative: boolean;
  geography: string;
  description: string;
  habitat: string;
  feeding: string;
  behavior: string;
  breeding: string;
  size: string;
  photos: BirdPhoto[];
};

export const birds: Bird[] = [
  {
    id: "calamon-comun",
    slug: "calamon-comun",
    commonName: "Calamón común",
    scientificName: "Porphyrio porphyrio",
    family: "Rallidae",
    isNative: true,
    geography: "...",
    description:
      "Ave acuática de plumaje azul violáceo intenso, pico rojo y patas largas. Suele encontrarse en humedales con abundante vegetación.",
    habitat:
      "Marismas, lagunas, carrizales y zonas húmedas con vegetación densa.",
    feeding:
      "Se alimenta principalmente de brotes, tallos, semillas y vegetación acuática, aunque puede consumir pequeños invertebrados.",
    behavior:
      "Es un ave visible en bordes de carrizal y zonas abiertas de humedal. Camina entre la vegetación y puede mostrarse territorial.",
    breeding:
      "Cría en zonas húmedas, construyendo el nido entre vegetación palustre.",
    size: "Aproximadamente 45-50 cm de longitud.",
    photos: [
      {
        id: "calamon-01",
        src: "/gallery/calamon.jpg",
        alt: "Calamón común fotografiado en zona húmeda",
        uploadedAt: "2026-06-25T18:00:00.000Z",
      },
    ],
  },
  {
    id: "garcilla-cangrejera",
    slug: "garcilla-cangrejera",
    commonName: "Garcilla cangrejera",
    scientificName: "Ardeola ralloides",
    family: "Ardeidae",
    isNative: true,
    geography: "...",
    description:
      "Garza pequeña de tonos ocres y blancos, especialmente llamativa durante el vuelo por el contraste de sus alas claras.",
    habitat:
      "Humedales, arrozales, riberas, lagunas someras y zonas con vegetación acuática.",
    feeding:
      "Consume peces pequeños, anfibios, insectos acuáticos, crustáceos y otros invertebrados.",
    behavior:
      "Suele permanecer quieta cerca del agua esperando a sus presas. En vuelo muestra alas muy claras.",
    breeding:
      "Cría en colonias, normalmente junto a otras garzas, en vegetación próxima al agua.",
    size: "Aproximadamente 40-49 cm de longitud.",
    photos: [
      {
        id: "garcilla-cangrejera-01",
        src: "/gallery/garcilla-cangrejera.jpg",
        alt: "Garcilla cangrejera junto al agua",
        uploadedAt: "2026-06-27T18:00:00.000Z",
      },
    ],
  },
  {
    id: "zampullin-chico",
    slug: "zampullin-chico",
    commonName: "Zampullín chico",
    scientificName: "Tachybaptus ruficollis",
    family: "Podicipedidae",
    isNative: true,
    geography: "...",
    description:
      "Pequeña ave acuática buceadora, de cuerpo compacto y comportamiento discreto. Suele desaparecer bajo el agua con rapidez.",
    habitat:
      "Lagunas, charcas, embalses pequeños, canales y humedales con vegetación en las orillas.",
    feeding:
      "Se alimenta de pequeños peces, insectos acuáticos, larvas, crustáceos y otros organismos acuáticos.",
    behavior:
      "Bucea con frecuencia y puede ser difícil de observar durante mucho tiempo seguido.",
    breeding: "Construye nidos flotantes o sujetos a vegetación acuática.",
    size: "Aproximadamente 25-29 cm de longitud.",
    photos: [
      {
        id: "zampullin-chico-01",
        src: "/gallery/zampullin-chico.jpg",
        alt: "Zampullín chico nadando en el agua",
        uploadedAt: "2026-06-28T18:00:00.000Z",
      },
    ],
  },
];
