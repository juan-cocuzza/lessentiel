"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Ruler,
  Shield,
  Truck,
  Sparkles,
  ArrowRight,
  Check,
  CreditCard,
  Flame,
  Plane,
  ShieldCheck,
  Timer,
  Clock,
  Info,
  HelpCircle,
} from "lucide-react";
import { products, sizeGuide } from "@/lib/data";
import type { Product } from "@/lib/types";
import { formatPrice, calculateDeposit, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Tabla comparativa detallada específica para botines de fútbol
const FOOTBALL_SIZE_TABLE = [
  { arg: 39, us: "7.0", uk: "6.0", cm: "25.0", recommended: "Pie normal / estrecho" },
  { arg: 40, us: "7.5", uk: "6.5", cm: "25.5", recommended: "Pie normal" },
  { arg: 41, us: "8.0", uk: "7.0", cm: "26.0", recommended: "Pie normal / ancho" },
  { arg: 42, us: "8.5", uk: "7.5", cm: "26.5", recommended: "Pie normal / ancho" },
  { arg: 43, us: "9.5", uk: "8.5", cm: "27.5", recommended: "Pie ancho" },
  { arg: 44, us: "10.0", uk: "9.0", cm: "28.0", recommended: "Pie ancho" },
  { arg: 45, us: "10.5", uk: "9.5", cm: "28.5", recommended: "Pie extra ancho" },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  // Buscar el producto en la lista local (o coincidir con slug/id)
  const product: Product | undefined = useMemo(() => {
    return products.find(
      (p) => p.id === productId || p.slug === productId
    );
  }, [productId]);

  // Si no se encuentra el producto, fallback elegante
  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-3xl font-bold text-ivory">
          Botín no encontrado
        </h1>
        <p className="mt-2 text-sm text-ivory/60">
          El modelo que buscás no existe o fue retirado del catálogo.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/">Volver al Catálogo</Link>
        </Button>
      </div>
    );
  }

  // Lista de imágenes interactivas
  const productImages: string[] = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [product.image];
  }, [product]);

  // Estados interactivos
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Cálculos de seña y saldo
  const isByRequest = product.is_by_request || product.availability === "preorder";
  const depositAmount = calculateDeposit(product.price);
  const balanceAmount = product.price - depositAmount;

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  // Acción de compra o reserva
  const handleAction = async () => {
    if (!selectedSize) return;

    setIsProcessing(true);
    try {
      // Llamar al endpoint /api/orders
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: "Cliente L'essentiel",
          customer_email: "cliente@example.com",
          items: [
            {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: quantity,
              size: selectedSize,
              is_by_request: isByRequest,
            },
          ],
        }),
      });

      const data = await response.json();

      if (data?.order?.id) {
        // Redirigir a checkout con Mercado Pago o vista de seguimiento
        router.push(`/checkout?orderId=${data.order.id}`);
      } else {
        router.push("/#stock");
      }
    } catch (err) {
      console.error("Error al procesar:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="section-padding min-h-screen bg-[#0A0A0B] text-ivory">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb / Navegación previa */}
        <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-wider text-ivory/50">
          <Link href="/" className="hover:text-gold transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/#stock" className="hover:text-gold transition-colors">
            Catálogo
          </Link>
          <span>/</span>
          <span className="text-gold font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ========================================================================= */}
          {/* COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES INTERACTIVA (7 columnas en LG) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-4">
            {/* Imagen Principal con controles */}
            <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden rounded-md border border-white/10 bg-graphite shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={productImages[activeImageIndex]}
                    alt={`${product.name} - Vista ${activeImageIndex + 1}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badge de disponibilidad */}
              <div className="absolute left-4 top-4 z-10">
                <Badge
                  variant={isByRequest ? "preorder" : "stock"}
                  className="text-xs px-3 py-1 shadow-lg backdrop-blur-md"
                >
                  {isByRequest ? "🛡️ Edición Por Encargo" : "⚡ Stock Inmediato"}
                </Badge>
              </div>

              {/* Botones de navegación Anterior / Siguiente si hay más de 1 imagen */}
              {productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-charcoal/80 text-ivory/80 backdrop-blur-md transition hover:border-gold hover:text-gold"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-charcoal/80 text-ivory/80 backdrop-blur-md transition hover:border-gold hover:text-gold"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Indicador numérico */}
                  <div className="absolute bottom-4 right-4 z-10 rounded-full bg-charcoal/80 px-3 py-1 text-xs font-mono text-ivory/70 border border-white/10 backdrop-blur-md">
                    {activeImageIndex + 1} / {productImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Miniaturas interactivas */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-sm border transition-all duration-300",
                      activeImageIndex === idx
                        ? "border-gold ring-2 ring-gold/40 shadow-[0_0_15px_rgba(201,169,98,0.3)] scale-[1.02]"
                        : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`Miniatura ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Garantías de Marca / Football Heritage */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6">
              <div className="flex items-center gap-3 rounded-sm border border-white/5 bg-charcoal-50/40 p-3.5">
                <ShieldCheck className="h-5 w-5 text-gold shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-ivory">Cuero Vacuno 100%</p>
                  <p className="text-ivory/50 text-[11px]">Confección artesanal</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-sm border border-white/5 bg-charcoal-50/40 p-3.5">
                <Truck className="h-5 w-5 text-gold shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-ivory">Envío Asegurado</p>
                  <p className="text-ivory/50 text-[11px]">A todo el país</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-sm border border-white/5 bg-charcoal-50/40 p-3.5">
                <Ruler className="h-5 w-5 text-gold shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-ivory">Cambio de Talle</p>
                  <p className="text-ivory/50 text-[11px]">Garantía L&apos;essentiel</p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUMNA DERECHA: INFORMACIÓN, SELECTOR DE TALLE Y BOTONES (5 columnas) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Marca y Colección */}
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  {product.brand} • Calzado Profesional
                </p>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-mono text-ivory/60 border border-white/10 uppercase">
                  {product.category}
                </span>
              </div>

              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ivory sm:text-4xl">
                {product.name}
              </h1>

              {/* Precios */}
              <div className="mt-4 rounded-sm border border-white/10 bg-charcoal-50/60 p-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-ivory/50">
                    {isByRequest ? "Precio Final Total" : "Precio de Venta"}
                  </span>
                  <span className="font-display text-3xl font-bold text-gold">
                    {formatPrice(product.price)}
                  </span>
                </div>

                {isByRequest && (
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-xs">
                    <div>
                      <p className="text-ivory/50">Seña para reservar (50%):</p>
                      <p className="text-sm font-semibold text-gold-light mt-0.5">
                        {formatPrice(depositAmount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-ivory/50">Saldo al despacho (50%):</p>
                      <p className="text-sm font-semibold text-ivory/80 mt-0.5">
                        {formatPrice(balanceAmount)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Descripción */}
              <p className="mt-5 text-sm text-ivory/70 leading-relaxed">
                {product.description}
              </p>

              {/* =================================================================== */}
              {/* SELECTOR DE TALLE INTERACTIVO + MODAL GUÍA DE TALLES */}
              {/* =================================================================== */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-ivory/70">
                    Elegí tu Talle (ARG)
                  </label>

                  {/* MODAL DE GUÍA DE TALLES: BOTÓN "¿Cuál es mi talle?" */}
                  <Dialog open={isSizeGuideOpen} onOpenChange={setIsSizeGuideOpen}>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-light transition-colors underline-offset-4 hover:underline"
                      >
                        <Ruler className="h-3.5 w-3.5" />
                        <span>¿Cuál es mi talle?</span>
                      </button>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl bg-charcoal-100 border border-gold/40 text-ivory p-6 sm:p-8">
                      <DialogHeader>
                        <div className="flex items-center gap-2 text-gold">
                          <Ruler className="h-5 w-5" />
                          <span className="text-[11px] font-semibold uppercase tracking-widest">
                            Guía Oficial de Calzado
                          </span>
                        </div>
                        <DialogTitle className="font-display text-2xl font-bold text-ivory mt-1">
                          Tabla de Equivalencias para Botines
                        </DialogTitle>
                        <DialogDescription className="text-xs text-ivory/70">
                          Los botines de cuero de alto rendimiento se adaptan a la horma de tu pie. Te recomendamos comparar la medida en centímetros de tu plantilla habitual.
                        </DialogDescription>
                      </DialogHeader>

                      {/* Tabla comparativa específica para botines */}
                      <div className="mt-4 overflow-hidden rounded-sm border border-white/10 bg-charcoal-50">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="border-b border-white/10 bg-white/5 font-semibold uppercase tracking-wider text-gold">
                              <th className="py-3 px-3.5">ARG</th>
                              <th className="py-3 px-3.5">CM Plantilla</th>
                              <th className="py-3 px-3.5">US</th>
                              <th className="py-3 px-3.5">UK</th>
                              <th className="py-3 px-3.5 hidden sm:table-cell">Ajuste recomendado</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-mono">
                            {FOOTBALL_SIZE_TABLE.map((item, idx) => (
                              <tr
                                key={item.arg}
                                className={cn(
                                  "transition-colors",
                                  selectedSize === item.arg
                                    ? "bg-gold/15 text-gold-light font-bold"
                                    : idx % 2 === 0
                                    ? "bg-transparent"
                                    : "bg-white/[0.02]"
                                )}
                              >
                                <td className="py-2.5 px-3.5 font-bold text-ivory">
                                  {item.arg}
                                </td>
                                <td className="py-2.5 px-3.5 text-gold">
                                  {item.cm} cm
                                </td>
                                <td className="py-2.5 px-3.5 text-ivory/70">
                                  {item.us}
                                </td>
                                <td className="py-2.5 px-3.5 text-ivory/70">
                                  {item.uk}
                                </td>
                                <td className="py-2.5 px-3.5 text-[11px] text-ivory/50 font-sans hidden sm:table-cell">
                                  {item.recommended}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Consejos prácticos de medición de fútbol */}
                      <div className="mt-4 rounded-sm border border-gold/20 bg-gold/5 p-4 text-xs space-y-2">
                        <p className="font-semibold text-gold flex items-center gap-1.5">
                          <Info className="h-4 w-4" />
                          ¿Cómo medir tu pie con precisión futbolera?
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-ivory/70 pl-1">
                          <li>Apoyá una hoja en el suelo contra un zócalo o pared lisa.</li>
                          <li>Colocá tu talón firme contra la pared y dibujá una línea en el dedo más largo.</li>
                          <li>Medí la distancia en centímetros. Si usás medias de compresión o térmicas, agregá 0.5 cm de margen.</li>
                        </ol>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Button
                          onClick={() => setIsSizeGuideOpen(false)}
                          className="w-full sm:w-auto"
                        >
                          Entendido, volver a elegir
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Grilla de selección de talle */}
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    const sizeInfo = FOOTBALL_SIZE_TABLE.find((s) => s.arg === size);

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "relative flex flex-col items-center justify-center h-12 rounded-sm border text-sm font-medium transition-all duration-200",
                          isSelected
                            ? "border-gold bg-gold/20 text-gold shadow-[0_0_20px_rgba(201,169,98,0.4)] ring-2 ring-gold"
                            : "border-white/10 bg-charcoal-50 text-ivory/80 hover:border-gold/50 hover:text-gold"
                        )}
                      >
                        <span className="font-mono font-bold leading-none">{size}</span>
                        {sizeInfo && (
                          <span className="text-[9px] text-ivory/40 leading-none mt-1">
                            {sizeInfo.cm}cm
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {!selectedSize && (
                  <p className="mt-2 text-xs text-amber-400/80">
                    * Por favor, seleccioná tu talle antes de continuar.
                  </p>
                )}
              </div>

              {/* =================================================================== */}
              {/* BOTÓN DINÁMICO Y TARJETA EXPLICATIVA SEGÚN TIPO DE PRODUCTO */}
              {/* =================================================================== */}
              <div className="mt-8 space-y-4">
                {isByRequest ? (
                  /* CASO 1: PRODUCTO POR ENCARGO (is_by_request === true) */
                  <div className="rounded-md border border-gold/40 bg-gradient-to-br from-gold/10 via-charcoal-50 to-charcoal-50 p-5 shadow-xl">
                    <div className="flex items-center gap-2 text-gold">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ivory">
                        Flujo de Pedido Por Encargo (Pre-order)
                      </h4>
                    </div>

                    <p className="mt-2 text-xs text-ivory/70 leading-relaxed">
                      Este par es confeccionado e importado especialmente para vos bajo demanda de nuestros artesanos.
                    </p>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs border-t border-gold/15 pt-3">
                      <div className="flex items-start gap-2">
                        <Flame className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-ivory">1. Seña 50%</p>
                          <p className="text-[11px] text-ivory/50">
                            Congelás el precio hoy ({formatPrice(depositAmount)})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Plane className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-ivory">2. En Cancha</p>
                          <p className="text-[11px] text-ivory/50">
                            Tránsito y tracking minuto a minuto
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Timer className="h-4 w-4 text-gold-light shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-ivory">3. Saldo Final</p>
                          <p className="text-[11px] text-ivory/50">
                            Abonás el 50% al ingresar al vestuario
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* BOTÓN DESTACADO: RESERVAR CON EL 50% DE SEÑA */}
                    <Button
                      onClick={handleAction}
                      disabled={!selectedSize || isProcessing}
                      size="lg"
                      className="mt-5 w-full gap-2 text-sm bg-gradient-to-r from-gold to-gold-light text-charcoal font-bold tracking-wider uppercase shadow-[0_0_25px_rgba(201,169,98,0.4)] hover:shadow-[0_0_35px_rgba(201,169,98,0.6)]"
                    >
                      <ShieldCheck className="h-5 w-5" />
                      <span>
                        {isProcessing
                          ? "Iniciando Reserva..."
                          : selectedSize
                          ? `Reservar con el 50% de Seña (${formatPrice(depositAmount)})`
                          : "Seleccioná un Talle para Reservar"}
                      </span>
                    </Button>
                  </div>
                ) : (
                  /* CASO 2: PRODUCTO EN STOCK INMEDIATO (is_by_request === false) */
                  <div className="rounded-md border border-emerald-500/30 bg-charcoal-50 p-5 shadow-xl">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="h-4 w-4" />
                      <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ivory">
                        Disponible para Envío Inmediato
                      </h4>
                    </div>
                    <p className="mt-1 text-xs text-ivory/60">
                      Unidades físicas listas en vestuario. Despacho prioritario en 24 a 48 hs hábiles a todo el país.
                    </p>

                    {/* BOTÓN DESTACADO: COMPRAR AHORA */}
                    <Button
                      onClick={handleAction}
                      disabled={!selectedSize || isProcessing}
                      size="lg"
                      className="mt-5 w-full gap-2 text-sm font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(201,169,98,0.3)]"
                    >
                      <CreditCard className="h-5 w-5" />
                      <span>
                        {isProcessing
                          ? "Procesando..."
                          : selectedSize
                          ? `Comprar Ahora (${formatPrice(product.price)})`
                          : "Seleccioná tu Talle para Comprar"}
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

