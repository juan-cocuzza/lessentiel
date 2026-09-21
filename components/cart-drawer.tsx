"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Shield,
  Zap,
  Landmark,
  Percent,
  ArrowRight,
  Sparkles,
  Info,
  Check,
  CreditCard,
  Lock,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalCount,
    totalAmount,
    hasPreorder,
    depositAmount,
    balanceAmount,
    payWithTransfer,
    setPayWithTransfer,
    transferDiscount,
    amountToPayNow,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [preferredSize, setPreferredSize] = useState<string>("");
  const [showEmailPrompt, setShowEmailPrompt] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("lessentiel_checkout_contact");
      if (saved) {
        const contact = JSON.parse(saved);
        setCustomerName(contact.name || "");
        setCustomerEmail(contact.email || "");
        setCustomerPhone(contact.phone || "");
        setPreferredSize(contact.preferredSize || "");
      }
    } catch {
      // Ignore malformed local checkout data.
    }
  }, []);

  // Proceder al pago conectando con /api/orders y /api/checkout
  const handleCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    // Si aún no ingresó datos de contacto, solicitar brevemente el email/nombre
    if (!customerEmail.trim() || !customerName.trim() || !customerPhone.trim() || !preferredSize) {
      setShowEmailPrompt(true);
      return;
    }

    localStorage.setItem(
      "lessentiel_checkout_contact",
      JSON.stringify({
        name: customerName.trim(),
        email: customerEmail.trim().toLowerCase(),
        phone: customerPhone.trim(),
        preferredSize: Number(preferredSize),
      })
    );

    setIsCheckingOut(true);

    try {
      // 1. Crear la orden en Supabase mediante /api/orders
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim().toLowerCase(),
          phone: customerPhone.trim(),
          preferred_size: Number(preferredSize),
          payment_method: payWithTransfer ? "transferencia" : "mercadopago",
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            is_by_request: item.is_by_request,
          })),
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData?.order?.id) {
        throw new Error(
          orderData?.error || "Ocurrió un error al crear la orden."
        );
      }

      const orderId = orderData.order.id;

      // 2. Si eligió transferencia bancaria:
      if (payWithTransfer) {
        closeCart();
        window.location.href = `/checkout/success?orderId=${orderId}&paymentType=${hasPreorder ? "deposit" : "full"}`;
        return;
      }

      // 3. Si eligió Mercado Pago: generar preferencia mediante /api/checkout
      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId,
          paymentType: hasPreorder ? "deposit" : "full",
        }),
      });

      const checkoutData = await checkoutResponse.json();

      if (checkoutData?.initPoint) {
        // Redirigir a Mercado Pago
        window.location.href = checkoutData.initPoint;
      } else {
        closeCart();
        window.location.href = `/checkout/success?orderId=${orderId}&paymentType=${hasPreorder ? "deposit" : "full"}`;
      }
    } catch (err: any) {
      console.error("Error durante el checkout:", err);
      setErrorMsg(err?.message || "No se pudo procesar el pago. Reintentá.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay oscuro con desenfoque */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            {/* Panel lateral deslizante */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-charcoal-100 border-l border-white/10 shadow-2xl flex flex-col justify-between text-ivory"
            >
              {/* Encabezado del Carrito */}
              <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between bg-charcoal-50/70">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-gold/30 bg-gold/10 text-gold">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-ivory">
                      Bolsa de Compras
                    </h2>
                    <p className="text-xs text-ivory/50">
                      {totalCount} {totalCount === 1 ? "artículo" : "artículos"}{" "}
                      seleccionado{totalCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeCart}
                  className="rounded-sm p-2 text-ivory/60 hover:text-gold hover:bg-white/5 transition"
                  aria-label="Cerrar carrito"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Contenido / Lista de Items */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ivory/30 mb-4">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                    <h3 className="font-display text-lg font-medium text-ivory">
                      Tu bolsa está vacía
                    </h3>
                    <p className="mt-1 text-xs text-ivory/50 max-w-xs">
                      Explorá nuestra colección de botines de autor y sumá tu par preferido.
                    </p>
                    <Button
                      onClick={closeCart}
                      asChild
                      variant="outline"
                      className="mt-6"
                    >
                      <Link href="/#stock">Explorar Catálogo</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Lista de productos */}
                    <div className="space-y-3 divide-y divide-white/5">
                      {items.map((item) => (
                        <div
                          key={`${item.id}-${item.size}`}
                          className="pt-3 first:pt-0 flex gap-4"
                        >
                          {/* Miniatura */}
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-white/10 bg-graphite">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-display text-sm font-semibold text-ivory line-clamp-1">
                                  {item.name}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id, item.size)}
                                  className="text-ivory/40 hover:text-red-400 transition"
                                  title="Eliminar"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="mt-1 flex items-center gap-2 text-xs">
                                <span className="rounded bg-white/10 px-1.5 py-0.2 font-mono text-[10px] text-ivory/90">
                                  Talle {item.size}
                                </span>
                                {item.is_by_request ? (
                                  <Badge
                                    variant="preorder"
                                    className="text-[9px] px-1.5 py-0"
                                  >
                                    Por Encargo
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="stock"
                                    className="text-[9px] px-1.5 py-0"
                                  >
                                    Stock
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Controles de cantidad y precio */}
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center rounded-sm border border-white/15 bg-charcoal-50">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(item.id, item.size, -1)
                                  }
                                  className="px-2 py-1 text-ivory/60 hover:text-ivory hover:bg-white/5 transition"
                                  aria-label="Disminuir cantidad"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-2 text-xs font-mono font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(item.id, item.size, 1)
                                  }
                                  className="px-2 py-1 text-ivory/60 hover:text-ivory hover:bg-white/5 transition"
                                  aria-label="Aumentar cantidad"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <span className="font-display text-sm font-semibold text-gold">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* REQUISITO 2: DESGLOSE CLARO SI HAY PRODUCTO POR ENCARGO */}
                    {hasPreorder && (
                      <div className="mt-6 rounded-md border border-gold/30 bg-gradient-to-br from-gold/10 via-charcoal-50 to-charcoal-50 p-4 space-y-2.5">
                        <div className="flex items-center gap-2 text-gold">
                          <Sparkles className="h-4 w-4 animate-pulse" />
                          <h5 className="font-display text-xs font-bold uppercase tracking-wider text-gold-light">
                            Desglose de Edición Por Encargo
                          </h5>
                        </div>

                        <div className="space-y-1.5 text-xs border-t border-gold/15 pt-2 font-mono">
                          <div className="flex justify-between text-ivory/70">
                            <span>Precio Total del Botín:</span>
                            <span className="font-semibold text-ivory">
                              {formatPrice(totalAmount)}
                            </span>
                          </div>

                          <div className="flex justify-between text-gold font-bold text-sm bg-gold/10 p-2 rounded-sm border border-gold/20">
                            <span>A abonar hoy (Seña 50%):</span>
                            <span>{formatPrice(depositAmount)}</span>
                          </div>

                          <div className="flex justify-between text-ivory/60 text-[11px]">
                            <span>Saldo restante al recibir:</span>
                            <span>{formatPrice(balanceAmount)}</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-ivory/50 leading-relaxed italic pt-1">
                          * El 50% restante se abona cuando el botín ingresa a nuestro vestuario e inspeccionamos la calidad, previo al despacho final.
                        </p>
                      </div>
                    )}

                    {/* REQUISITO 3: INTERRUPTOR 10% DE DESCUENTO POR TRANSFERENCIA */}
                    <div className="mt-4 rounded-md border border-white/10 bg-charcoal-50/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-gold/10 text-gold border border-gold/20">
                            <Landmark className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-ivory">
                                Transferencia Bancaria
                              </span>
                              <span className="rounded-full bg-gold px-1.5 py-0.2 text-[9px] font-bold text-charcoal uppercase">
                                -10% OFF
                              </span>
                            </div>
                            <p className="text-[11px] text-ivory/50">
                              Descuento directo e instantáneo
                            </p>
                          </div>
                        </div>

                        {/* Switch Interactivo */}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={payWithTransfer}
                          onClick={() => setPayWithTransfer(!payWithTransfer)}
                          className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                            payWithTransfer ? "bg-gold" : "bg-white/20"
                          )}
                        >
                          <span
                            className={cn(
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-charcoal shadow-lg ring-0 transition duration-200 ease-in-out",
                              payWithTransfer ? "translate-x-5 bg-charcoal" : "translate-x-0 bg-ivory"
                            )}
                          />
                        </button>
                      </div>

                      {payWithTransfer && (
                        <div className="mt-3 border-t border-white/10 pt-2.5 text-xs text-gold flex items-center justify-between">
                          <span>Ahorrás con transferencia:</span>
                          <span className="font-bold font-mono">
                            -{formatPrice(transferDiscount)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Formulario rápido de datos si hace falta */}
                    {showEmailPrompt && (
                      <form
                        onSubmit={handleCheckout}
                        className="mt-4 rounded-md border border-gold/40 bg-charcoal-50 p-4 space-y-3"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider text-gold flex items-center gap-1.5">
                          <Info className="h-4 w-4" />
                          Datos para el Pedido y Notificaciones
                        </p>

                        <div>
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Nombre y Apellido completo"
                            className="w-full rounded-sm border border-white/15 bg-charcoal px-3 py-2 text-xs text-ivory placeholder:text-ivory/40 focus:border-gold focus:outline-none"
                            autoFocus
                          />
                        </div>

                        <div>
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="Teléfono / WhatsApp (con código de país)"
                            className="w-full rounded-sm border border-white/15 bg-charcoal px-3 py-2 text-xs text-ivory placeholder:text-ivory/40 focus:border-gold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label htmlFor="preferred-size" className="mb-1 block text-[10px] uppercase tracking-wider text-ivory/50">
                            Talle de calzado (ARG)
                          </label>
                          <select
                            id="preferred-size"
                            required
                            value={preferredSize}
                            onChange={(e) => setPreferredSize(e.target.value)}
                            className="w-full rounded-sm border border-white/15 bg-charcoal px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                          >
                            <option value="">Seleccioná tu talle</option>
                            {[39, 40, 41, 42, 43, 44, 45].map((size) => (
                              <option key={size} value={size}>{size} ARG</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <input
                            type="email"
                            required
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="Email para seguimiento y comprobante"
                            className="w-full rounded-sm border border-white/15 bg-charcoal px-3 py-2 text-xs text-ivory placeholder:text-ivory/40 focus:border-gold focus:outline-none"
                          />
                        </div>
                      </form>
                    )}

                    {errorMsg && (
                      <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded-sm border border-red-500/30">
                        {errorMsg}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Pie con Resumen de Totales y Botón de Pago */}
              {items.length > 0 && (
                <div className="border-t border-white/10 bg-charcoal-50/90 p-6 space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-ivory/60">
                      <span>Subtotal</span>
                      <span className="font-mono text-ivory">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>

                    {payWithTransfer && (
                      <div className="flex justify-between text-gold">
                        <span>Descuento Transferencia (-10%)</span>
                        <span className="font-mono">
                          -{formatPrice(transferDiscount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between border-t border-white/10 pt-2 text-sm">
                      <span className="font-medium text-ivory">
                        {hasPreorder ? "Total a abonar hoy (Seña):" : "Total a abonar:"}
                      </span>
                      <span className="font-display text-xl font-bold text-gold">
                        {formatPrice(amountToPayNow)}
                      </span>
                    </div>

                    {hasPreorder && (
                      <p className="text-[11px] text-right text-ivory/50">
                        Saldo restante: {formatPrice(balanceAmount)}
                      </p>
                    )}
                  </div>

                  {/* REQUISITO 4: BOTÓN PRINCIPAL 'Proceder al Pago' */}
                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    size="lg"
                    className="w-full gap-2 text-sm font-bold tracking-wider uppercase bg-gradient-to-r from-gold to-gold-light text-charcoal shadow-[0_0_25px_rgba(201,169,98,0.3)] hover:shadow-[0_0_35px_rgba(201,169,98,0.5)]"
                  >
                    {isCheckingOut ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-charcoal border-t-transparent" />
                        <span>Generando Pago...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        <span>
                          {payWithTransfer
                            ? `Confirmar Transferencia (${formatPrice(amountToPayNow)})`
                            : `Proceder al Pago (${formatPrice(amountToPayNow)})`}
                        </span>
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-3 text-[10px] text-ivory/40">
                    <span className="flex items-center gap-1">
                      <Lock className="h-3 w-3 text-gold" /> Pago 100% Seguro
                    </span>
                    <span>•</span>
                    <span>Mercado Pago & Transferencias</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;

