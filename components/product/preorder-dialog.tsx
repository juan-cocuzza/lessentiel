"use client";

import type { Product } from "@/lib/types";
import {
  formatPrice,
  calculateDeposit,
} from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, ShieldCheck, Truck } from "lucide-react";

interface PreorderDialogProps {
  product: Product;
  selectedSize: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreorderDialog({
  product,
  selectedSize,
  open,
  onOpenChange,
}: PreorderDialogProps) {
  const deposit = calculateDeposit(product.price);
  const balance = product.price - deposit;

  const steps = [
    {
      icon: ShieldCheck,
      title: "Reservá con el 50%",
      description: `Abonás ${formatPrice(deposit)} ahora para confirmar tu pedido.`,
    },
    {
      icon: Clock,
      title: "Producción y tránsito",
      description:
        "Seguí el estado de tu pedido en nuestra línea de tiempo personalizada.",
    },
    {
      icon: Truck,
      title: "Saldo al recibir",
      description: `El ${formatPrice(balance)} restante se abona antes del envío final.`,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reservar: {product.name}</DialogTitle>
          <DialogDescription>
            {selectedSize
              ? `Talle seleccionado: ${selectedSize}`
              : "Seleccioná un talle antes de continuar"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-sm border border-gold/20 bg-gold/5 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-ivory/70">Precio total</span>
              <span className="font-display text-lg text-gold">
                {formatPrice(product.price)}
              </span>
            </div>
            <div className="mt-3 space-y-2 border-t border-gold/10 pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-ivory/70">Seña (50%)</span>
                <span className="font-medium text-ivory">
                  {formatPrice(deposit)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ivory/70">Saldo pendiente</span>
                <span className="font-medium text-ivory/60">
                  {formatPrice(balance)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.title} className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-white/10 bg-white/5">
                  <step.icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ivory">{step.title}</p>
                  <p className="text-xs text-ivory/60">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            className="w-full"
            disabled={!selectedSize}
            onClick={() => {
              onOpenChange(false);
              /* Redirect to checkout with deposit amount */
            }}
          >
            Confirmar Reserva — {formatPrice(deposit)}
          </Button>

          <p className="text-center text-xs text-ivory/40">
            El saldo restante se abona al recibir, antes del despacho final.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
