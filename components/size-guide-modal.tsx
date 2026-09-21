"use client";

import type { ReactNode } from "react";
import { Ruler } from "lucide-react";
import { sizeGuide } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SizeGuideModalProps {
  selectedSize?: number | null;
  trigger?: ReactNode;
}

const recommendedFit: Record<number, string> = {
  39: "Pie normal / estrecho",
  40: "Pie normal",
  41: "Pie normal / ancho",
  42: "Pie normal / ancho",
  43: "Pie ancho",
  44: "Pie ancho",
  45: "Pie extra ancho",
};

export function SizeGuideModal({ selectedSize, trigger }: SizeGuideModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold transition-colors hover:text-gold-light hover:underline"
          >
            <Ruler className="h-3.5 w-3.5" />
            ¿Cuál es mi talle?
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl border border-gold/40 bg-charcoal-100 p-6 text-ivory sm:p-8">
        <DialogHeader>
          <div className="flex items-center gap-2 text-gold">
            <Ruler className="h-5 w-5" />
            <span className="text-[11px] font-semibold uppercase tracking-widest">
              Guía oficial de calzado
            </span>
          </div>
          <DialogTitle className="mt-1 font-display text-2xl font-bold text-ivory">
            Talles para botines de fútbol
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed text-ivory/70">
            Usá la medida de tu pie para encontrar la equivalencia ARG, US y UK.
            Si estás entre dos talles, elegí el superior.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 overflow-x-auto rounded-sm border border-white/10 bg-charcoal-50">
          <table className="w-full min-w-[500px] text-left text-xs">
            <caption className="sr-only">Equivalencias de talles de botines</caption>
            <thead>
              <tr className="border-b border-white/10 bg-white/5 font-semibold uppercase tracking-wider text-gold">
                <th className="px-3.5 py-3">Talle ARG</th>
                <th className="px-3.5 py-3">US</th>
                <th className="px-3.5 py-3">UK</th>
                <th className="px-3.5 py-3">CM de plantilla</th>
                <th className="hidden px-3.5 py-3 sm:table-cell">Ajuste</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sizeGuide.map((entry, index) => (
                <tr
                  key={entry.size}
                  className={
                    selectedSize === entry.size
                      ? "bg-gold/15 text-gold-light"
                      : index % 2 === 0
                        ? "bg-transparent"
                        : "bg-white/[0.02]"
                  }
                >
                  <td className="px-3.5 py-2.5 font-bold text-ivory">{entry.size}</td>
                  <td className="px-3.5 py-2.5 text-ivory/70">{entry.us}</td>
                  <td className="px-3.5 py-2.5 text-ivory/70">{entry.uk}</td>
                  <td className="px-3.5 py-2.5 font-medium text-gold">{entry.cm} cm</td>
                  <td className="hidden px-3.5 py-2.5 text-[11px] text-ivory/50 sm:table-cell">
                    {recommendedFit[entry.size]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-2 rounded-sm border border-gold/20 bg-gold/5 p-4 text-xs">
          <p className="font-semibold text-gold">Cómo medir tu pie</p>
          <ol className="list-decimal space-y-1 pl-4 leading-relaxed text-ivory/70">
            <li>Apoyá una hoja en el piso, contra una pared o zócalo.</li>
            <li>Parate con el talón firme contra la pared y marcá el extremo del dedo pulgar.</li>
            <li>Medí en centímetros desde el talón hasta la marca del dedo más largo.</li>
            <li>Repetí la medición en ambos pies y tomá como referencia el más largo.</li>
          </ol>
          <p className="pt-1 text-ivory/50">
            Medite al final del día y usando las medias con las que vas a jugar.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
