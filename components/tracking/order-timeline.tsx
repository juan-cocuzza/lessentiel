"use client";

import { useState, type ElementType, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Flame,
  MapPin,
  Shield,
  Timer,
  Trophy,
  Search,
} from "lucide-react";
import { trackingSteps } from "@/lib/data";
import type { TrackingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const stepIcons: Record<TrackingStatus, ElementType> = {
  "entrada-calor": Flame,
  "en-cancha": MapPin,
  "en-vestuario": Shield,
  "tiempo-descuento": Timer,
  "final-juego": Trophy,
};

export function OrderTimeline() {
  const router = useRouter();
  const [orderCode, setOrderCode] = useState("");
  const [activeStep, setActiveStep] = useState<TrackingStatus | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const clean = orderCode.trim();
    if (clean) {
      // Si parece un ID de Supabase (UUID o al menos 8 caracteres), redirigir a la pantalla de tracking dedicada
      if (clean.length >= 8) {
        router.push(`/orders/${clean}`);
        return;
      }
      setActiveStep("en-vestuario");
      setSearched(true);
    }
  };

  const activeIndex = activeStep
    ? trackingSteps.findIndex((s) => s.id === activeStep)
    : -1;

  return (
    <section id="seguimiento" className="section-padding scroll-mt-24 bg-charcoal-100/50">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="label-caps mb-2">Seguimiento</p>
          <h2 className="heading-section">Tu pedido en la cancha</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-ivory/60">
            Seguí cada etapa de tu botín con nuestra línea de tiempo
            personalizada, del calentamiento al pitazo final.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
            placeholder="Código de pedido (ej: LES-2026-001)"
            className="flex-1 rounded-sm border border-white/10 bg-charcoal-50 px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
          />
          <Button type="submit" className="gap-2">
            <Search className="h-4 w-4" />
            Buscar
          </Button>
        </form>

        {searched && activeStep && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <p className="mb-8 text-center text-sm text-ivory/50">
              Pedido <span className="font-mono text-gold">{orderCode}</span>
            </p>

            <div className="relative">
              <div className="absolute left-6 top-0 h-full w-px bg-white/10 sm:left-1/2 sm:-translate-x-px" />

              {trackingSteps.map((step, index) => {
                const Icon = stepIcons[step.id];
                const isCompleted = index <= activeIndex;
                const isCurrent = index === activeIndex;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className={cn(
                      "relative mb-8 flex items-start gap-4 sm:mb-12",
                      index % 2 === 0
                        ? "sm:flex-row-reverse sm:text-right"
                        : "sm:flex-row"
                    )}
                  >
                    <div
                      className={cn(
                        "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 sm:absolute sm:left-1/2 sm:-translate-x-1/2",
                        isCompleted
                          ? "border-gold bg-gold/20 text-gold"
                          : "border-white/10 bg-charcoal text-ivory/30",
                        isCurrent && "shadow-[0_0_20px_rgba(201,169,98,0.4)]"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div
                      className={cn(
                        "flex-1 rounded-sm border p-4 transition-all duration-300 sm:max-w-[calc(50%-3rem)]",
                        isCompleted
                          ? "border-gold/20 bg-gold/5"
                          : "border-white/5 bg-white/[0.02]",
                        isCurrent && "ring-1 ring-gold/30"
                      )}
                    >
                      <p className="text-xs uppercase tracking-wider text-gold">
                        {step.subtitle}
                      </p>
                      <h3 className="mt-1 font-display text-lg font-medium text-ivory">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-ivory/60">
                        {step.description}
                      </p>
                    </div>

                    <div className="hidden flex-1 sm:block" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {!searched && (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {trackingSteps.map((step) => {
              const Icon = stepIcons[step.id];
              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center rounded-sm border border-white/5 bg-white/[0.02] p-4 text-center"
                >
                  <Icon className="mb-2 h-5 w-5 text-gold/60" />
                  <p className="text-[10px] uppercase tracking-wider text-ivory/50">
                    {step.title}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
