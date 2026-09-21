"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatPrice, calculateDeposit, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SizeGuide } from "@/components/product/size-guide";
import { PreorderDialog } from "@/components/product/preorder-dialog";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showPreorder, setShowPreorder] = useState(false);
  const { addItem } = useCart();
  const isStock = product.availability === "stock";
  const deposit = calculateDeposit(product.price);
  const productImages = product.images?.length ? product.images : [product.image];
  const activeImage = productImages[activeImageIndex] || product.image;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group flex flex-col overflow-hidden rounded-sm border border-white/10 bg-charcoal-50/50 transition-all duration-300 hover:border-gold/30 hover:shadow-[0_8px_40px_rgba(201,169,98,0.12)]"
      >
        <Link
          href={`/products/${product.id}`}
          className="relative aspect-square overflow-hidden bg-graphite block cursor-pointer"
        >
          <Image
            unoptimized
            src={activeImage}
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
        </Link>

        {productImages.length > 1 && (
          <div className="flex gap-2 border-b border-white/10 bg-charcoal-50/40 px-4 py-3">
            {productImages.slice(0, 5).map((image, imageIndex) => (
              <button
                key={`${image}-${imageIndex}`}
                type="button"
                onClick={() => setActiveImageIndex(imageIndex)}
                aria-label={`Ver imagen ${imageIndex + 1}`}
                className={cn(
                  "relative h-10 w-10 overflow-hidden rounded-sm border transition",
                  activeImageIndex === imageIndex
                    ? "border-gold ring-1 ring-gold/50"
                    : "border-white/10 opacity-60 hover:opacity-100"
                )}
              >
                <Image unoptimized src={image} alt="" fill className="object-cover" sizes="40px" />
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="label-caps text-[10px]">{product.brand}</p>
          <Link href={`/products/${product.id}`}>
            <h3 className="mt-1 font-display text-lg font-medium text-ivory sm:text-xl hover:text-gold transition-colors">
              {product.name}
            </h3>
          </Link>
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
                  if (selectedSize) addItem(product, selectedSize);
                }}
              >
                Comprar Ahora
              </Button>
            ) : (
              <Button
                className="w-full"
                variant="outline"
                disabled={!selectedSize}
                onClick={() => {
                  if (selectedSize) addItem(product, selectedSize);
                }}
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
