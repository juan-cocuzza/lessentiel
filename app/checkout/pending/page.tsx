"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clock, ArrowRight, ShoppingBag, MessageCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function CheckoutPendingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || searchParams.get("external_reference");

  return (
    <div className="section-padding min-h-screen bg-[#0A0A0B] text-ivory">
      <div className="relative mx-auto max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <Clock className="h-10 w-10 animate-pulse" />
        </div>

        <h1 className="font-display text-2xl font-bold tracking-tight text-ivory sm:text-3xl">
          Pago en Proceso de Verificación
        </h1>

        <p className="mx-auto mt-3 text-sm text-ivory/70 leading-relaxed">
          Mercado Pago está acreditando tu transacción. Una vez confirmado, tu orden pasará automáticamente a <strong className="text-gold">Entrada en Calor</strong>.
        </p>

        {orderId && (
          <div className="mt-6 rounded-md border border-white/10 bg-charcoal-100 p-4 font-mono text-xs text-gold">
            Pedido #{orderId.slice(0, 8)}
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {orderId && (
            <Button asChild className="w-full sm:w-auto gap-2">
              <Link href={`/orders/${orderId}`}>
                <span>Ver Estado del Pedido</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}

          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/">
              <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
              Volver al Catálogo
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPendingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0B]" />}>
      <CheckoutPendingContent />
    </Suspense>
  );
}

