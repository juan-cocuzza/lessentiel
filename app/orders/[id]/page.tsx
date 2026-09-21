import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { OrderTracking } from "@/components/order-tracking";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, ShieldCheck } from "lucide-react";

interface OrderTrackingPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: OrderTrackingPageProps): Promise<Metadata> {
  const shortId = params.id ? params.id.slice(0, 8) : "";
  return {
    title: `Seguimiento de Orden #${shortId} | L'essentiel`,
    description: `Seguí el minuto a minuto de tu pedido #${shortId} en L'essentiel.`,
  };
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { id } = params;

  return (
    <div className="section-padding min-h-screen bg-[#0A0A0B] text-ivory">
      {/* Fondo sutil con resplandor dorado */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Breadcrumb de Navegación */}
        <nav className="mb-6 flex items-center justify-between text-xs text-ivory/50">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 hover:text-gold transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Volver a la Tienda</span>
          </Link>

          <span className="font-mono text-gold font-semibold">
            #{id.slice(0, 8)}
          </span>
        </nav>

        {/* Encabezado Principal */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-gold mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Portal Oficial de Seguimiento</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ivory sm:text-4xl">
            Minuto a Minuto de tu Pedido
          </h1>
          <p className="mt-2 max-w-xl text-xs text-ivory/60 sm:text-sm">
            Consultá en tiempo real el progreso de confección, tránsito y control de calidad artesanal de tus botines.
          </p>
        </div>

        {/* Componente Interactivo de Tracking */}
        <OrderTracking orderId={id} className="mt-6" />

        {/* Barra de Soporte y Ayuda */}
        <div className="mt-10 rounded-md border border-white/10 bg-charcoal-100/60 p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-display text-sm font-semibold text-ivory">
                ¿Tenés alguna consulta sobre tu pedido?
              </h3>
              <p className="mt-1 text-xs text-ivory/60">
                Nuestro equipo de atención personalizada está disponible para resolver dudas sobre talles, envíos y tiempos.
              </p>
            </div>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `¡Hola L'essentiel! Quisiera consultar sobre el estado de mi orden #${id.slice(
                  0,
                  8
                )}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-emerald-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-emerald-500 shrink-0"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Contactar Soporte</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

