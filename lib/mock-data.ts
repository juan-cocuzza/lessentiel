import type { Product } from "./types";

/**
 * Catálogo ficticio de botines de fútbol de alta gama para L'essentiel
 * Contiene modelos en stock inmediato y modelos por encargo artesanal con especificaciones técnicas detalladas.
 */
export const MOCK_BOOTS: Product[] = [
  {
    id: "botin-d10s-legacy-pro",
    name: "D10S Legacy Pro Carbon",
    brand: "L'essentiel Atelier",
    slug: "d10s-legacy-pro-carbon",
    description:
      "Chasis de fibra de carbono aeroespacial con cuero de becerro seleccionado a mano. Edición conmemorativa inspirada en el control absoluto del Diez en el Estadio Azteca. Textura microperforada en el empeine para un toque milimétrico y absorción de impacto superior en terreno firme.",
    price: 189000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200&q=80",
      "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=1200&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1200&q=80",
    ],
    is_by_request: false,
    availability: "stock",
    category: "edicion-limitada",
    sizes: [40, 41, 42, 43, 44],
    featured: true,
    stock_quantity: 8,
    specs: {
      sole_type: "FG (Césped Natural Firme) - 12 tapones cónicos de tracción rotacional",
      material: "Cuero de becerro italiano hidrofugado con placa interior de carbono 3K",
      weight: "198g (Talle 41 ARG)",
      origin: "Montebelluna, Italia / Ajuste final en filial L'essentiel",
    },
  },
  {
    id: "botin-la-mano-de-dios",
    name: "La Mano de Dios '86 Gold",
    brand: "L'essentiel Couture",
    slug: "la-mano-de-dios-86-gold",
    description:
      "Homenaje a la máxima hazaña de la historia futbolística. Confeccionado íntegramente a mano bajo pedido especial. Piel vacuna premium tratada con aceites naturales para máxima flexibilidad, ojales enchapados en oro mate y talonera esculpida con grabado de fecha conmemorativa.",
    price: 215000,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
      "https://images.unsplash.com/photo-1606107557195-0a74c706baf1?w=1200&q=80",
      "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=1200&q=80",
      "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=1200&q=80",
    ],
    is_by_request: true,
    availability: "preorder",
    category: "clasicos",
    sizes: [39, 40, 41, 42, 43, 44, 45],
    featured: true,
    stock_quantity: 0,
    specs: {
      sole_type: "FG / AG Híbrida - Placa reactiva de Pebax con tapones semi-cónicos",
      material: "Cuero vacuno flor suave de curtición artesanal con ribetes dorados",
      weight: "205g (Talle 41 ARG)",
      origin: "Producción por encargo exclusivo - Entrega en 25 a 35 días hábiles",
    },
  },
  {
    id: "botin-napoles-scudetto",
    name: "Nápoles Scudetto '87",
    brand: "L'essentiel",
    slug: "napoles-scudetto-87",
    description:
      "Inspirado en la histórica corona lograda al pie del Vesubio. Cuero azul profundo curtido en Campania con costuras de refuerzo en hilo dorado. Diseñado para terrenos blandos o húmedos con tapones intercambiables de aluminio y cuello acolchado anatómico.",
    price: 230000,
    image: "https://images.unsplash.com/photo-1606107557195-0a74c706baf1?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0a74c706baf1?w=1200&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
      "https://images.unsplash.com/photo-1514989940743-460b47ccfd54?w=1200&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200&q=80",
    ],
    is_by_request: true,
    availability: "preorder",
    category: "edicion-limitada",
    sizes: [40, 41, 42, 43, 44],
    featured: true,
    stock_quantity: 0,
    specs: {
      sole_type: "SG (Soft Ground / Césped Húmedo) - 6 tapones intercambiables de aluminio + 5 de TPU",
      material: "Piel de canguro K-Leather azul Nápoles con tratamiento antideslizante Grip+",
      weight: "215g (Talle 41 ARG)",
      origin: "Taller artesanal de Campania, Italia",
    },
  },
  {
    id: "botin-estadio-azteca-titanium",
    name: "Estadio Azteca Titanium",
    brand: "L'essentiel",
    slug: "estadio-azteca-titanium",
    description:
      "Estructura monocasco ultraliviana para futbolistas veloces y dinámicos. Suela con inserciones de titanio flexible que multiplica el retorno de energía en cada zancada. Lengüeta plegable retro con banda elástica de sujeción inferior.",
    price: 165000,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
    ],
    is_by_request: false,
    availability: "stock",
    category: "modernos",
    sizes: [40, 41, 42, 43, 44, 45],
    featured: false,
    stock_quantity: 12,
    specs: {
      sole_type: "FG (Césped Firme) - Placa SprintFrame con alma de titanio",
      material: "Microfibra sintética ultraligera FlyLeather de 1.1mm",
      weight: "185g (Talle 41 ARG)",
      origin: "Serie limitada de precisión - En stock para entrega en 24/48hs",
    },
  },
  {
    id: "botin-barrilete-cosmico-elite",
    name: "Barrilete Cósmico Carbon Elite",
    brand: "L'essentiel Couture",
    slug: "barrilete-cosmico-carbon-elite",
    description:
      "La máxima expresión del diseño futbolero de autor. Empeine esculpido en textura 3D para imprimir efectos venenosos y trayectorias curvas imparables. Cada unidad incluye número de serie grabado a láser y caja de presentación en roble con certificado de autenticidad.",
    price: 245000,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa0?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa0?w=1200&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
      "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=1200&q=80",
      "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=1200&q=80",
    ],
    is_by_request: true,
    availability: "preorder",
    category: "modernos",
    sizes: [41, 42, 43, 44],
    featured: true,
    stock_quantity: 0,
    specs: {
      sole_type: "FG (Césped Natural) - Suela íntegra de fibra de carbono 3K pre-impregnada",
      material: "Piel tratada térmicamente con nervaduras de tracción en silicona",
      weight: "192g (Talle 41 ARG)",
      origin: "Pieza a medida por encargo con control artesanal individual",
    },
  },
  {
    id: "botin-campeon-del-mundo-3s",
    name: "Campeón del Mundo 3 Estrellas",
    brand: "L'essentiel",
    slug: "campeon-del-mundo-3-estrellas",
    description:
      "La gloria inmortal condensada en un calzado legendario. Tres estrellas bordadas en hilo dorado de alta densidad, cuero blanco marfil y detalles celestes tenues que rinden tributo a la camiseta albiceleste. Plantilla anatómica con amortiguación Poron® para confort supremo.",
    price: 178000,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
      "https://images.unsplash.com/photo-1606107557195-0a74c706baf1?w=1200&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80",
    ],
    is_by_request: false,
    availability: "stock",
    category: "clasicos",
    sizes: [39, 40, 41, 42, 43, 44],
    featured: false,
    stock_quantity: 15,
    specs: {
      sole_type: "FG (Césped Firme) - Configuración clásica de 12 tacos cónicos inyectados",
      material: "Cuero flor de primera selección con curtido vegetal ecológico",
      weight: "210g (Talle 41 ARG)",
      origin: "Confección artesanal en Buenos Aires / Stock físico listo para retiro",
    },
  },
  {
    id: "botin-la-bombonera-81-vintage",
    name: "La Bombonera '81 Vintage",
    brand: "L'essentiel Atelier",
    slug: "la-bombonera-81-vintage",
    description:
      "El botín negro de culto con el que se gambeteaba en el barro de las canchas sudamericanas en los años 80. Cuero de 1.8mm de espesor con doble costura reforzada en puntera, tapones negros macizos y lengüeta volcable con el monograma de L'essentiel grabado a calor.",
    price: 155000,
    image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
      "https://images.unsplash.com/photo-1606107557195-0a74c706baf1?w=1200&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1200&q=80",
    ],
    is_by_request: false,
    availability: "stock",
    category: "clasicos",
    sizes: [40, 41, 42, 43, 44],
    featured: false,
    stock_quantity: 6,
    specs: {
      sole_type: "FG Clásica - 12 tapones de poliuretano vulcanizado de máxima durabilidad",
      material: "Cuero vacuno curtido al cromo con acabado oleoso impermeable",
      weight: "228g (Talle 41 ARG)",
      origin: "Inspiración retro de época - Ensamblado en taller propio",
    },
  },
  {
    id: "botin-venezia-grand-gala",
    name: "Venezia Grand Gala Oro Puro",
    brand: "L'essentiel Couture",
    slug: "venezia-grand-gala-oro-puro",
    description:
      "Concebido como una obra de arte para el 'Diez' lírico que juega de traje y corbata. Suela con baño electroquímico en cromo dorado espejo, empeine aterciopelado con ribetes geométricos y cuello anatómico en tejido elástico Knit que elimina rozaduras.",
    price: 260000,
    image: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=1200&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&q=80",
    ],
    is_by_request: true,
    availability: "preorder",
    category: "edicion-limitada",
    sizes: [39, 40, 41, 42, 43, 44, 45],
    featured: true,
    stock_quantity: 0,
    specs: {
      sole_type: "FG / SG Mixta - Placa cromada en oro pulido con tapones combinados de magnesio",
      material: "Piel de becerro aterciopelada tratada con nanotecnología repelente al agua",
      weight: "202g (Talle 41 ARG)",
      origin: "Véneto, Italia / Confección numerada de alta costura futbolera",
    },
  },
  {
    id: "botin-copa-del-rey-blackout",
    name: "Copa del Rey '84 Blackout",
    brand: "L'essentiel",
    slug: "copa-del-rey-84-blackout",
    description:
      "Estética monocromática 'Blackout' para los puristas del juego sobrio, aguerrido y elegante. Cuero graneado de altísima resistencia a la fricción, plantilla antimicrobiana con canales de ventilación y puntera reforzada para remates potentes de media distancia.",
    price: 192000,
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1200&q=80",
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200&q=80",
      "https://images.unsplash.com/photo-1606107557195-0a74c706baf1?w=1200&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80",
    ],
    is_by_request: false,
    availability: "stock",
    category: "clasicos",
    sizes: [40, 41, 42, 43, 44],
    featured: false,
    stock_quantity: 9,
    specs: {
      sole_type: "FG (Terreno Firme) - Tacos de tracción multidireccional de doble densidad",
      material: "Cuero graneado heavy-duty hidrofóbico con lengüeta acolchada",
      weight: "218g (Talle 41 ARG)",
      origin: "Taller artesanal de calzado deportivo / En stock para despacho inmediato",
    },
  },
];

/**
 * Función de utilidad para obtener todos los productos mockeados
 */
export function getMockProducts(): Product[] {
  return [...MOCK_BOOTS];
}

/**
 * Función de utilidad para buscar un producto mockeado por ID o slug
 */
export function getMockProductById(idOrSlug: string): Product | undefined {
  if (!idOrSlug) return undefined;
  return MOCK_BOOTS.find(
    (boot) => boot.id === idOrSlug || boot.slug === idOrSlug
  );
}

