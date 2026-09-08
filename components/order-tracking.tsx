"use client";

import React, { useEffect, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Plane,
  ShieldCheck,
  Timer,
  Trophy,
  Check,
  CreditCard,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { supabase, type OrderRow, type OrderStatus } from "@/lib/supabase";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface OrderTrackingProps {
  orderId: string;
  className?: string;
  onPayBalance?: (order: OrderRow) => void;
}

interface FootballTimelineStep {
  id: OrderStatus;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  matchMinute: string; // Detalle futbolero tipo "00'", "45'", "80'", "90+3'", "FT"
}

const FOOTBALL_STEPS: FootballTimelineStep[] = [
  {
    id: "entrada-en-calor",
    title: "Entrada en Calor",
    subtitle: "Seña abonada",
    description:
      "Seña inicial confirmada. Comenzamos los preparativos y la confección de tu pedido.",
    icon: Flame,
    matchMinute: "00'",
  },
  {
    id: "en-cancha",
    title: "En Cancha",
    subtitle: "Botines importándose",
    description:
      "Tu par está en pleno juego, viajando en tránsito internacional desde origen.",
    icon: Plane,
    matchMinute: "45'",
  },
  {
    id: "en-vestuario",
    title: "En el Vestuario",
    subtitle: "Llegaron, control de calidad",
    description:
      "Llegada a nuestro centro. Inspeccionamos exhaustivamente materiales, cuero y detalles.",
    icon: ShieldCheck,
    matchMinute: "80'",
  },
  {
    id: "tiempo-de-descuento",
    title: "Tiempo de Descuento",
    subtitle: "Saldo pendiente de pago",
    description:
      "¡Tramo decisivo! Tu par está listo para el envío. Aboná el 50% restante para el despacho.",
    icon: Timer,
    matchMinute: "90+3'",
  },
  {
    id: "final-del-juego",
    title: "Final del Juego",
    subtitle: "Enviado / Entregado",
    description:
      "¡Pitazo final! Tu par va en camino a tu domicilio o ya está en tus manos para romperla.",
    icon: Trophy,
    matchMinute: "FT",
  },
];

const STATUS_ORDER: OrderStatus[] = [
  "entrada-en-calor",
  "en-cancha",
  "en-vestuario",
  "tiempo-de-descuento",
  "final-del-juego",
];

export function OrderTracking({
  orderId,
  className,
  onPayBalance,
}: OrderTrackingProps) {
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Función para obtener la orden desde Supabase
  const fetchOrder = React.useCallback(
    async (showLoading = true) => {
      if (showLoading) setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (fetchError) {
          throw new Error(
            fetchError.code === "PGRST116"
              ? "No se encontró ningún pedido con este código."
              : fetchError.message
          );
        }

        setOrder(data);
      } catch (err: any) {
        setError(err?.message || "Ocurrió un error al consultar el pedido.");
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    [orderId]
  );

  useEffect(() => {
    if (!orderId) return;

    fetchOrder(true);

    // Suscripción a cambios en tiempo real vía Supabase Realtime
    const channel = supabase
      .channel(`order-tracking-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          if (payload.new) {
            setOrder(payload.new as OrderRow);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, fetchOrder]);

  const activeIndex = order
    ? STATUS_ORDER.indexOf(order.status)
    : -1;

  // Monto del saldo pendiente (50% en pedidos por encargo o total pendiente)
  const remainingBalance = order
    ? Math.round(Number(order.total_amount) * 0.5)
    : 0;

  // Estado de carga inicial
  if (isLoading) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-md border border-gold/20 bg-charcoal-100/90 p-8 shadow-2xl backdrop-blur-md",
          className
        )}
      >
        <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
          <div className="relative">
            <div className="h-14 w-14 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
            <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-gold/60 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display text-lg text-ivory">
              Conectando con el vestuario...
            </h3>
            <p className="mt-1 text-xs text-ivory/50">
              Obteniendo el estado del partido para la orden #{orderId.slice(0, 8)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error || !order) {
    return (
      <div
        className={cn(
          "rounded-md border border-red-500/20 bg-charcoal-100/95 p-8 text-center shadow-2xl",
          className
        )}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-lg text-ivory">
          No pudimos localizar la orden
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ivory/60">
          {error || "El código ingresado no coincide con ningún pedido registrado."}
        </p>
        <Button
          onClick={() => fetchOrder(true)}
          variant="outline"
          className="mt-6 gap-2 text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Intentar nuevamente
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-gold/20 bg-charcoal-100/95 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-md sm:p-8",
        className
      )}
    >
      {/* Fondo de textura sutil con brillo dorado */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />

      {/* Cabecera temática del partido */}
      <div className="relative border-b border-white/10 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-gold border border-gold/30">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                Seguimiento Oficial
              </span>
              {order.is_preorder && (
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-ivory/60 border border-white/10">
                  Edición por Encargo
                </span>
              )}
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-wide text-ivory sm:text-3xl">
              Estado de tu Pedido
            </h2>
            <p className="mt-1 text-xs text-ivory/60">
              Cliente:{" "}
              <span className="font-medium text-ivory">
                {order.customer_name}
              </span>{" "}
              • Ref:{" "}
              <span className="font-mono text-gold">
                #{order.id.slice(0, 8)}
              </span>
            </p>
          </div>

          {/* Botón de actualizar rápido */}
          <button
            type="button"
            onClick={() => startTransition(() => fetchOrder(false))}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-sm border border-white/10 bg-charcoal-50 px-3 py-1.5 text-xs text-ivory/70 transition-all hover:border-gold/40 hover:text-gold"
            title="Refrescar estado"
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", isPending && "animate-spin text-gold")}
            />
            <span>{isPending ? "Actualizando..." : "Actualizar"}</span>
          </button>
        </div>

        {/* Resumen financiero rápido */}
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-sm border border-white/5 bg-charcoal-50/50 p-3 sm:grid-cols-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ivory/40">
              Total Orden
            </p>
            <p className="font-display text-sm font-semibold text-ivory sm:text-base">
              {formatPrice(Number(order.total_amount))}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-ivory/40">
              Seña Inicial
            </p>
            <p
              className={cn(
                "text-xs sm:text-sm font-medium",
                order.deposit_paid ? "text-emerald-400" : "text-amber-300"
              )}
            >
              {order.deposit_paid ? "✓ Abonada (50%)" : "Pendiente"}
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-[10px] uppercase tracking-wider text-ivory/40">
              Saldo Restante
            </p>
            <p
              className={cn(
                "text-xs sm:text-sm font-medium",
                order.balance_paid
                  ? "text-emerald-400"
                  : "text-gold font-semibold"
              )}
            >
              {order.balance_paid
                ? "✓ 100% Cancelado"
                : `${formatPrice(remainingBalance)}`}
            </p>
          </div>
        </div>
      </div>

      {/* Línea de tiempo (Timeline Vertical con diseño de cancha / vestuario) */}
      <div className="relative mt-8">
        {/* Barra vertical de progreso continuo */}
        <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-white/10 sm:left-[27px]" />

        {/* Barra de progreso completada con degradado dorado */}
        <div
          className="absolute left-[23px] top-6 w-[2px] bg-gradient-to-b from-gold via-gold-light to-gold transition-all duration-700 sm:left-[27px]"
          style={{
            height:
              activeIndex <= 0
                ? "0%"
                : `${(activeIndex / (FOOTBALL_STEPS.length - 1)) * 100}%`,
          }}
        />

        <div className="space-y-8">
          {FOOTBALL_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < activeIndex;
            const isCurrent = index === activeIndex;
            const isUpcoming = index > activeIndex;

            // Condición solicitada: si estamos en Tiempo de Descuento y balance_paid es false
            const isDiscountTimeStep = step.id === "tiempo-de-descuento";
            const showBalancePayment =
              isDiscountTimeStep && !order.balance_paid;

            return (
              <div
                key={step.id}
                className={cn(
                  "group relative flex items-start gap-4 transition-all duration-300 sm:gap-6",
                  isUpcoming && "opacity-40"
                )}
              >
                {/* Indicador circular de nodo en la línea de tiempo */}
                <div
                  className={cn(
                    "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 sm:h-14 sm:w-14",
                    isCompleted &&
                      "border-gold bg-gold text-charcoal shadow-[0_0_15px_rgba(201,169,98,0.4)]",
                    isCurrent &&
                      "border-gold bg-charcoal text-gold ring-4 ring-gold/20 shadow-[0_0_25px_rgba(201,169,98,0.6)] animate-pulse",
                    isUpcoming &&
                      "border-white/15 bg-charcoal-50 text-ivory/30"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6 stroke-[3]" />
                  ) : (
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  )}

                  {/* Badge con el minuto de juego */}
                  <span
                    className={cn(
                      "absolute -bottom-2 rounded-full px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase",
                      isCurrent
                        ? "bg-gold text-charcoal shadow-sm"
                        : isCompleted
                        ? "bg-charcoal-50 text-gold border border-gold/40"
                        : "bg-charcoal text-ivory/40 border border-white/10"
                    )}
                  >
                    {step.matchMinute}
                  </span>
                </div>

                {/* Tarjeta de información del paso */}
                <div
                  className={cn(
                    "flex-1 rounded-md border p-4 sm:p-5 transition-all duration-300",
                    isCurrent
                      ? "border-gold/50 bg-gradient-to-br from-gold/10 via-charcoal-50 to-charcoal-50 ring-1 ring-gold/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                      : isCompleted
                      ? "border-gold/20 bg-charcoal-50/70"
                      : "border-white/5 bg-charcoal-50/20"
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-gold">
                      {step.subtitle}
                    </span>
                    {isCurrent && (
                      <span className="rounded-sm bg-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-light border border-gold/40">
                        Etapa Actual
                      </span>
                    )}
                  </div>

                  <h3 className="mt-1 font-display text-lg font-semibold text-ivory sm:text-xl">
                    {step.title}
                  </h3>

                  <p className="mt-1.5 text-xs text-ivory/70 sm:text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* REQUISITO: Botón de pago si estamos en 'Tiempo de Descuento' y balance_paid es false */}
                  {showBalancePayment && (
                    <div className="mt-4 rounded-sm border border-gold/40 bg-gold/5 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                            Segundo Tiempo: Saldo Restante
                          </p>
                          <p className="text-xs text-ivory/70 mt-0.5">
                            Completá el 50% restante (
                            <span className="font-semibold text-ivory font-display">
                              {formatPrice(remainingBalance)}
                            </span>
                            ) para habilitar el envío inmediato.
                          </p>
                        </div>

                        <Button
                          onClick={() => {
                            if (onPayBalance) {
                              onPayBalance(order);
                            } else {
                              // Redirección por defecto al checkout o pasarela con referencia de orden
                              window.location.href = `/checkout?orderId=${order.id}&payment=balance`;
                            }
                          }}
                          className="shrink-0 gap-2 shadow-[0_0_20px_rgba(201,169,98,0.3)] hover:shadow-[0_0_30px_rgba(201,169,98,0.5)]"
                          size="sm"
                        >
                          <CreditCard className="h-4 w-4" />
                          Abonar Saldo ({formatPrice(remainingBalance)})
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Si ya abonó el saldo en esta etapa, mostrar confirmación */}
                  {isDiscountTimeStep && order.balance_paid && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                      <Check className="h-4 w-4" />
                      Saldo total completado. El calzado ingresa a despacho final.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pie con detalles y soporte */}
      <div className="mt-8 border-t border-white/10 pt-4 text-center">
        <p className="text-xs text-ivory/40">
          ¿Tenés consultas sobre tu pedido? Escribinos a{" "}
          <a
            href="mailto:contacto@lessentiel.com"
            className="text-gold underline hover:text-gold-light transition-colors"
          >
            soporte@lessentiel.com
          </a>{" "}
          indicando tu número de orden.
        </p>
      </div>
    </div>
  );
}

export default OrderTracking;
