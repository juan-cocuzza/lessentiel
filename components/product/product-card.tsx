"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatPrice, calculateDeposit, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SizeGuide } from "@/components/product/size-guide";
import { PreorderDialog } from "@/components/product/preorder-dialog";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [showPreorder, setShowPreorder] = useState(false);
  const isStock = product.availability === "stock";
  const deposit = calculateDeposit(product.price);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group flex flex-col overflow-hidden rounded-sm border border-white/10 bg-charcoal-50/50 transition-all duration-300 hover:border-gold/30 hover:shadow-[0_8px_40px_rgba(201,169,98,0.12)]"
      >
        <div className="relative aspect-square overflow-hidden bg-graphite">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute left-3 top-3">
            <Badge variant={isStock ? "stock" : "preorder"}>
              {isStock ? "Stock" : "Por Encargo"}
            </Badge>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="label-caps text-[10px]">{product.brand}</p>
          <h3 className="mt-1 font-display text-lg font-medium text-ivory sm:text-xl">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-ivory/60">
            {product.description}
          </p>

          <p className="mt-4 font-display text-xl text-gold">
            {formatPrice(product.price)}
          </p>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-ivory/50">
                Talle
              </span>
              <SizeGuide />
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-sm border text-sm font-medium transition-all",
                    selectedSize === size
                      ? "border-gold bg-gold/20 text-gold"
                      : "border-white/10 text-ivory/70 hover:border-gold/50 hover:text-gold"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-5">
            {isStock ? (
              <Button
                className="w-full"
                disabled={!selectedSize}
                onClick={() => {
                  /* Checkout flow — stock */
                }}
              >
                Comprar Ahora
              </Button>
            ) : (
              <Button
                className="w-full"
                variant="outline"
                disabled={!selectedSize}
                onClick={() => setShowPreorder(true)}
              >
                Reservar con el 50%
              </Button>
            )}
            {!isStock && (
              <p className="mt-2 text-center text-xs text-ivory/40">
                Seña: {formatPrice(deposit)} · Saldo al recibir
              </p>
            )}
          </div>
        </div>
      </motion.article>

      <PreorderDialog
        product={product}
        selectedSize={selectedSize}
        open={showPreorder}
        onOpenChange={setShowPreorder}
      />
    </>
  );
}
