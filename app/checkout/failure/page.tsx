"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, RefreshCw, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function CheckoutFailureContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || searchParams.get("external_reference");

  return (
    <div className="section-padding min-h-screen bg-[#0A0A0B] text-ivory">
      <div className="relative mx-auto max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <h1 className="font-display text-2xl font-bold tracking-tight text-ivory sm:text-3xl">
          El Pago No Pudo Completarse
        </h1>

        <p className="mx-auto mt-3 text-sm text-ivory/70 leading-relaxed">
          No pudimos procesar el cobro a través de la pasarela. No te preocupes: tu selección sigue guardada y podés volver a intentar o abonar mediante transferencia bancaria.
        </p>

        {orderId && (
          <div className="mt-6 rounded-md border border-white/10 bg-charcoal-100 p-4 font-mono text-xs text-ivory/60">
            Referencia de Orden: #{orderId.slice(0, 8)}
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild className="w-full sm:w-auto gap-2">
            <Link href="/">
              <RefreshCw className="h-4 w-4" />
              <span>Volver a Intentar</span>
            </Link>
          </Button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `¡Hola L'essentiel! Tuve un problema al procesar el pago de mi pedido #${
                orderId ? orderId.slice(0, 8) : ""
              } y quisiera asistencia para abonar por transferencia.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20 transition-all w-full sm:w-auto"
          >
            <MessageCircle className="h-4 w-4 text-emerald-400" />
            <span>Asistencia por WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFailurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0B]" />}>
      <CheckoutFailureContent />
    </Suspense>
  );
}

