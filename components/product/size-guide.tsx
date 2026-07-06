"use client";

import type { ReactNode } from "react";
import { sizeGuide } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";

interface SizeGuideProps {
  trigger?: ReactNode;
}

export function SizeGuide({ trigger }: SizeGuideProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="sm" className="gap-2 normal-case">
            <Ruler className="h-4 w-4" />
            Guía de talles
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Guía de Talles</DialogTitle>
          <DialogDescription>
            Medí la longitud de tu pie desde el talón hasta el dedo más largo.
            Recomendamos elegir el talle superior si estás entre dos medidas.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 overflow-hidden rounded-sm border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-gold">
                  AR
                </th>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-gold">
                  CM
                </th>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-gold">
                  US
                </th>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-gold">
                  UK
                </th>
              </tr>
            </thead>
            <tbody>
              {sizeGuide.map((entry, index) => (
                <tr
                  key={entry.size}
                  className={
                    index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                  }
                >
                  <td className="px-4 py-3 font-medium text-ivory">
                    {entry.size}
                  </td>
                  <td className="px-4 py-3 text-ivory/70">{entry.cm}</td>
                  <td className="px-4 py-3 text-ivory/70">{entry.us}</td>
                  <td className="px-4 py-3 text-ivory/70">{entry.uk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-ivory/50">
          Tip: medí al final del día, cuando el pie está más hinchado, para
          mayor precisión.
        </p>
      </DialogContent>
    </Dialog>
  );
}
