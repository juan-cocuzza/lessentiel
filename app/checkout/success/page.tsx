"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Trophy,
  ArrowRight,
  Flame,
  ShieldCheck,
  Copy,
  Check,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Clock,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { supabase, type OrderRow } from "@/lib/supabase";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId =
    searchParams.get("orderId") ||
    searchParams.get("external_reference") ||
    "";
  const paymentId =
    searchParams.get("payment_id") ||
    searchParams.get("collection_id") ||
    "";
  const paymentTypeParam = searchParams.get("paymentType");

  const { clearCart } = useCart();
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasCopiedId, setHasCopiedId] = useState<boolean>(false);

  // Vaciar el carrito al completar el checkout y buscar la orden en Supabase
  useEffect(() => {
    // Vaciar el carrito local ya que la orden fue procesada
    clearCart();

    async function loadOrder() {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (error) {
          console.warn("No se pudo obtener la orden desde Supabase:", error);
          const localOrder = localStorage.getItem(`lessentiel_order_${orderId}`);
          if (localOrder) {
            setOrder(JSON.parse(localOrder));
          }
        } else if (data) {
          setOrder(data);
        }
      } catch (err) {
        console.error("Error al consultar orden:", err);
        const localOrder = localStorage.getItem(`lessentiel_order_${orderId}`);
        if (localOrder) {
          setOrder(JSON.parse(localOrder));
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderId, clearCart]);

  const copyOrderId = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    setHasCopiedId(true);
    setTimeout(() => setHasCopiedId(false), 2000);
  };

  // Cálculos financieros de la orden
  const totalAmount = order ? Number(order.total_amount) : 0;
  const isPreorder = order ? order.is_preorder : paymentTypeParam === "deposit";
  const depositPaidAmount = isPreorder ? Math.round(totalAmount * 0.5) : totalAmount;
  const remainingBalanceAmount = isPreorder ? totalAmount - depositPaidAmount : 0;

  const orderItems = Array.isArray(order?.items) ? order?.items : [];

  return (
    <div className="section-padding min-h-screen bg-[#0A0A0B] text-ivory">
      {/* Resplandor dorado de fondo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl">
        {/* Cabecera de Celebración */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Icono de Trofeo / Check con halo brillante */}
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold/50 bg-gradient-to-b from-gold/20 to-gold/5 text-gold shadow-[0_0_35px_rgba(201,169,98,0.4)]">
            <Trophy className="h-10 w-10 animate-pulse text-gold" />
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-gold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>¡Golazo! Pago Confirmado</span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-ivory sm:text-4xl">
            {isPreorder
              ? "Seña Recibida. ¡Arrancó el Partido!"
              : "¡Tu compra ha sido confirmada!"}
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm text-ivory/70 leading-relaxed">
            {isPreorder
              ? "Tu reserva quedó registrada con éxito. Ya estamos preparando la confección de tu par de botines exclusivos."
              : "Tu pedido ya está siendo preparado en nuestro centro de distribución para ser despachado a la brevedad."}
          </p>
        </motion.div>

        {/* Tarjeta Principal de Información de la Orden */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 rounded-md border border-gold/30 bg-charcoal-100/90 p-6 shadow-2xl backdrop-blur-md sm:p-8"
        >
          {/* Bloque: Código de Orden */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ivory/50">
                Código de Pedido
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-gold">
                  #{orderId ? orderId.slice(0, 8) : "LESSENTIEL"}
                </span>
                {orderId && (
                  <button
                    onClick={copyOrderId}
                    className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-1 text-[11px] font-mono text-ivory/70 hover:bg-white/10 hover:text-gold transition-colors"
                    title="Copiar ID de orden completo"
                  >
                    {hasCopiedId ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copiar ID</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={isPreorder ? "preorder" : "stock"}>
                {isPreorder ? "Por Encargo" : "Stock Inmediato"}
              </Badge>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                Pago Acreditado
              </span>
            </div>
          </div>

          {/* REQUISITO: Resumen de la Seña Abonada */}
          <div className="mt-6 rounded-md border border-gold/30 bg-gradient-to-br from-gold/10 via-charcoal-50 to-charcoal-50 p-5 shadow-inner">
            <div className="flex items-center gap-2 mb-3 text-gold">
              <CreditCard className="h-4 w-4" />
              <h2 className="text-xs font-semibold uppercase tracking-wider font-display">
                {isPreorder ? "Desglose Financiero de la Seña" : "Resumen del Pago"}
              </h2>
            </div>

            {isPreorder ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ivory/80">Precio Total de los Botines:</span>
                  <span className="font-display font-semibold text-ivory">
                    {formatPrice(totalAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm border-t border-white/10 pt-2.5">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Check className="h-4 w-4" />
                    Seña Abonada Hoy (50%):
                  </span>
                  <span className="font-display text-base font-bold text-emerald-400">
                    {formatPrice(depositPaidAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-white/10 pt-2.5 text-gold-light">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gold" />
                    Saldo Restante al Recibir (50%):
                  </span>
                  <span className="font-display font-semibold text-gold">
                    {formatPrice(remainingBalanceAmount)}
                  </span>
                </div>

                <div className="mt-3 rounded border border-gold/20 bg-charcoal/80 p-3 text-[11px] text-ivory/70 leading-relaxed">
                  <p>
                    <strong className="text-gold">¿Cómo sigue el pago?</strong> El 50% restante se abona cuando los botines lleguen a nuestro vestuario y superen el control de calidad. Te notificaremos con el enlace directo para pagar el saldo antes del despacho final.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ivory/80">Total de la Compra (100%):</span>
                  <span className="font-display text-base font-bold text-emerald-400">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <p className="text-[11px] text-ivory/60">
                  Tu pago completo ha sido procesado y acreditado con éxito.
                </p>
              </div>
            )}
          </div>

          {/* Detalle de Botines Adquiridos */}
          {orderItems.length > 0 && (
            <div className="mt-6 border-t border-white/10 pt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ivory/50 mb-3">
                Calzado Seleccionado
              </h3>
              <div className="space-y-2.5">
                {orderItems.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-sm border border-white/5 bg-charcoal-50/60 p-3 text-xs"
                  >
                    <div>
                      <p className="font-medium text-ivory">
                        {item.name || "Botín L'essentiel"}
                      </p>
                      <p className="text-[11px] text-ivory/50 mt-0.5 font-mono">
                        {item.size ? `Talle: ${item.size} ARG` : "Talle Estándar"}{" "}
                        {item.quantity > 1 && `• Cantidad: ${item.quantity}`}
                      </p>
                    </div>
                    <span className="font-display font-semibold text-gold">
                      {formatPrice(Number(item.price || 0) * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información del Cliente */}
          {order && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-white/10 pt-5 text-xs">
              <div>
                <p className="text-[10px] uppercase font-semibold text-ivory/40">
                  Titular del Pedido
                </p>
                <p className="mt-0.5 font-medium text-ivory">
                  {order.customer_name}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-ivory/40">
                  Comprobante Enviado a
                </p>
                <p className="mt-0.5 font-mono text-ivory/70">
                  {order.customer_email}
                </p>
              </div>
            </div>
          )}

          {/* REQUISITO PRINCIPAL: Botón 'Ver Seguimiento de mi Pedido' */}
          <div className="mt-8 border-t border-white/10 pt-6 space-y-3">
            <Button
              asChild
              size="lg"
              className="w-full gap-2 bg-gradient-to-r from-gold via-gold-light to-gold text-charcoal font-bold tracking-wide shadow-[0_0_25px_rgba(201,169,98,0.4)] hover:shadow-[0_0_35px_rgba(201,169,98,0.6)] py-6 text-sm"
            >
              <Link href={orderId ? `/orders/${orderId}` : "/#seguimiento"}>
                <span>Ver Seguimiento de mi Pedido</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Button asChild variant="outline" size="sm" className="w-full sm:w-auto text-xs">
                <Link href="/">
                  <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                  Volver a la Tienda
                </Link>
              </Button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `¡Hola L'essentiel! Acabo de realizar el pago de mi pedido #${
                    orderId ? orderId.slice(0, 8) : ""
                  } y quisiera coordinar detalles.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors w-full sm:w-auto"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>¿Dudas? Escribinos por WhatsApp</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function CheckoutSuccessFallback() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#0A0A0B] text-ivory">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
      <p className="mt-4 font-display text-sm text-ivory/70">
        Cargando confirmación de pedido...
      </p>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

