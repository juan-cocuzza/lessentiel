import type { Product, SizeGuideEntry, TrackingStep } from "./types";

export const products: Product[] = [
  {
    id: "1",
    name: "D10S Legacy Pro",
    brand: "L'essentiel",
    slug: "d10s-legacy-pro",
    description:
      "Cuero premium con detalles dorados. Edición inspirada en la mística del Diez. Suela de 12 tapones cónicos para césped natural, plantilla acolchada con memoria y textura microperforada para un control de pelota milimétrico.",
    price: 189000,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200&q=80",
      "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=1200&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1200&q=80",
    ],
    availability: "stock",
    is_by_request: false,
    category: "edicion-limitada",
    sizes: [40, 41, 42, 43, 44],
    featured: true,
  },
  {
    id: "2",
    name: "La Mano de Dios",
    brand: "L'essentiel",
    slug: "la-mano-de-dios",
    description:
      "Silueta clásica con suela de tracción superior. Para quienes juegan con alma. Confeccionado íntegramente a mano bajo pedido especial con cuero de becerro seleccionado.",
    price: 145000,
    image:
      "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
      "https://images.unsplash.com/photo-1606107557195-0a74c706baf1?w=1200&q=80",
      "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=1200&q=80",
      "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=1200&q=80",
    ],
    availability: "preorder",
    is_by_request: true,
    category: "clasicos",
    sizes: [39, 40, 41, 42, 43, 44, 45],
    featured: true,
  },
  {
    id: "3",
    name: "Nápoles '86",
    brand: "L'essentiel",
    slug: "napoles-86",
    description:
      "Homenaje al campeonato italiano. Confección artesanal bajo pedido. Cuero azul profundo con costuras reforzadas en hilo dorado y talonera acolchada que previene rozaduras.",
    price: 210000,
    image:
      "https://images.unsplash.com/photo-1606107557195-0a74c706baf1?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0a74c706baf1?w=1200&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
      "https://images.unsplash.com/photo-1514989940743-460b47ccfd54?w=1200&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200&q=80",
    ],
    availability: "preorder",
    is_by_request: true,
    category: "edicion-limitada",
    sizes: [40, 41, 42, 43],
    featured: true,
  },
  {
    id: "4",
    name: "Estadio Azteca Elite",
    brand: "L'essentiel",
    slug: "estadio-azteca-elite",
    description:
      "Tecnología moderna con acabados de lujo. Disponible para envío inmediato. Estructura ligera aerodinámica, placa de fibra sintética reactiva y suela FG para máxima aceleración.",
    price: 165000,
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&q=80",
    ],
    availability: "stock",
    is_by_request: false,
    category: "modernos",
    sizes: [40, 41, 42, 43, 44, 45],
  },
  {
    id: "5",
    name: "Barrilete Cósmico",
    brand: "L'essentiel",
    slug: "barrilete-cosmico",
    description:
      "Diseño audaz con textura de carbono. Producción limitada por encargo. Empeine texturado en relieve para efectos curvados y golpeo quirúrgico.",
    price: 198000,
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa0?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa0?w=1200&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
      "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=1200&q=80",
    ],
    availability: "preorder",
    is_by_request: true,
    category: "modernos",
    sizes: [41, 42, 43, 44],
  },
  {
    id: "6",
    name: "Campeón del Mundo",
    brand: "L'essentiel",
    slug: "campeon-del-mundo",
    description:
      "La esencia del fútbol argentino en cada puntada. Stock disponible. Los colores patrios con inserciones de estrellas bordadas en hilo dorado de alta densidad.",
    price: 172000,
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
      "https://images.unsplash.com/photo-1606107557195-0a74c706baf1?w=1200&q=80",
    ],
    availability: "stock",
    is_by_request: false,
    category: "clasicos",
    sizes: [39, 40, 41, 42, 43],
  },
];

export const sizeGuide: SizeGuideEntry[] = [
  { size: 39, cm: "25.0", us: "7", uk: "6" },
  { size: 40, cm: "25.5", us: "7.5", uk: "6.5" },
  { size: 41, cm: "26.0", us: "8", uk: "7" },
  { size: 42, cm: "26.5", us: "8.5", uk: "7.5" },
  { size: 43, cm: "27.5", us: "9.5", uk: "8.5" },
  { size: 44, cm: "28.0", us: "10", uk: "9" },
  { size: 45, cm: "28.5", us: "10.5", uk: "9.5" },
];

export const trackingSteps: TrackingStep[] = [
  {
    id: "entrada-calor",
    title: "Entrada en Calor",
    subtitle: "Seña confirmada",
    description: "Recibimos tu seña del 50%. El pedido entra a producción.",
  },
  {
    id: "en-cancha",
    title: "En Cancha",
    subtitle: "Tránsito internacional",
    description: "Tu par está en camino desde nuestros proveedores premium.",
  },
  {
    id: "en-vestuario",
    title: "En el Vestuario",
    subtitle: "Control de calidad",
    description: "Inspeccionamos cada detalle antes del envío final.",
  },
  {
    id: "tiempo-descuento",
    title: "Tiempo de Descuento",
    subtitle: "Saldo pendiente",
    description: "Te contactamos para abonar el 50% restante antes del despacho.",
  },
  {
    id: "final-juego",
    title: "Final del Juego",
    subtitle: "Enviado",
    description: "Tu pedido está en camino. ¡A jugar con alma!",
  },
];

export const stockProducts = products.filter((p) => p.availability === "stock");
export const preorderProducts = products.filter(
  (p) => p.availability === "preorder"
);
