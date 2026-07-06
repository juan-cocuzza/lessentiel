"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Landmark, Percent, Shield } from "lucide-react";
import type { PaymentMethod } from "@/lib/types";
import {
  formatPrice,
  calculateTransferDiscount,
} from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SAMPLE_TOTAL = 189000;

export function CheckoutSection() {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("mercadopago");

  const transferTotal = calculateTransferDiscount(SAMPLE_TOTAL);
  const discount = SAMPLE_TOTAL - transferTotal;
  const finalTotal =
    paymentMethod === "transferencia" ? transferTotal : SAMPLE_TOTAL;

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="label-caps mb-2">Checkout</p>
          <h2 className="heading-section">Elegí tu forma de pago</h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-ivory/60">
            Pagá de forma segura con Mercado Pago o aprovechá un 10% de
            descuento con transferencia bancaria.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          <button
            type="button"
            onClick={() => setPaymentMethod("mercadopago")}
            className={cn(
              "flex w-full items-center gap-4 rounded-sm border p-5 text-left transition-all duration-300",
              paymentMethod === "mercadopago"
                ? "border-gold/40 bg-gold/5 ring-1 ring-gold/20"
                : "border-white/10 bg-charcoal-50/50 hover:border-white/20"
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#009EE3]/10">
              <CreditCard className="h-6 w-6 text-[#009EE3]" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-ivory">Mercado Pago</p>
              <p className="text-sm text-ivory/50">
                Tarjetas, cuotas y dinero en cuenta
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-lg text-ivory">
                {formatPrice(SAMPLE_TOTAL)}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("transferencia")}
            className={cn(
              "relative flex w-full items-center gap-4 overflow-hidden rounded-sm border p-5 text-left transition-all duration-300",
              paymentMethod === "transferencia"
                ? "border-gold/40 bg-gold/5 ring-1 ring-gold/20"
                : "border-white/10 bg-charcoal-50/50 hover:border-white/20"
            )}
          >
            <div className="absolute right-0 top-0 rounded-bl-sm bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-charcoal">
              -10% OFF
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-gold/10">
              <Landmark className="h-6 w-6 text-gold" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-ivory">Transferencia Bancaria</p>
              <p className="text-sm text-ivory/50">
                Descuento automático del 10%
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-ivory/40 line-through">
                {formatPrice(SAMPLE_TOTAL)}
              </p>
              <p className="font-display text-lg text-gold">
                {formatPrice(transferTotal)}
              </p>
            </div>
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={paymentMethod}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden rounded-sm border border-white/10 bg-charcoal-50/30 p-5"
          >
            {paymentMethod === "mercadopago" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-ivory/70">
                  <Shield className="h-4 w-4 text-[#009EE3]" />
                  Pago protegido por Mercado Pago
                </div>
                <div className="flex h-12 items-center justify-center rounded-sm bg-[#009EE3] font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90">
                  Pagar con Mercado Pago
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gold">
                  <Percent className="h-4 w-4" />
                  Ahorrás {formatPrice(discount)} con transferencia
                </div>
                <div className="space-y-2 rounded-sm bg-white/5 p-4 font-mono text-sm text-ivory/70">
                  <p>
                    <span className="text-ivory/40">CBU:</span> 0000003100010000000001
                  </p>
                  <p>
                    <span className="text-ivory/40">Alias:</span> LESSENTIEL.BOOTS
                  </p>
                  <p>
                    <span className="text-ivory/40">Titular:</span> L&apos;essentiel SRL
                  </p>
                </div>
                <p className="text-xs text-ivory/40">
                  Enviá el comprobante por WhatsApp o email para confirmar tu
                  pedido. El descuento del 10% se aplica automáticamente.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 rounded-sm border border-white/10 bg-charcoal-50/50 p-5">
          <div className="flex justify-between text-sm">
            <span className="text-ivory/60">Subtotal</span>
            <span>{formatPrice(SAMPLE_TOTAL)}</span>
          </div>
          {paymentMethod === "transferencia" && (
            <div className="mt-2 flex justify-between text-sm text-gold">
              <span>Descuento transferencia (-10%)</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="mt-4 flex justify-between border-t border-white/10 pt-4">
            <span className="font-medium">Total</span>
            <span className="font-display text-2xl text-gold">
              {formatPrice(finalTotal)}
            </span>
          </div>
        </div>

        <Button className="mt-6 w-full" size="lg">
          {paymentMethod === "mercadopago"
            ? "Ir a Mercado Pago"
            : "Confirmar Transferencia"}
        </Button>
      </div>
    </section>
  );
}
