"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0 bg-carbon-texture" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal" />

      <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-4 pt-24 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="order-2 text-center lg:order-1 lg:text-left"
        >
          <p className="label-caps mb-4">Colección Premium</p>
          <h1 className="heading-display">
            <span className="block text-ivory">El alma</span>
            <span className="text-gradient-gold">de tus pies</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ivory/70 lg:mx-0 lg:text-lg">
            Botines de fútbol de alta gama con la mística de Maradona. Stock
            inmediato y piezas exclusivas bajo encargo.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Button asChild size="lg">
              <Link href="#stock">Ver Catálogo</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#encargo">Pedidos por Encargo</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="order-1 lg:order-2"
        >
          <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-sm border border-gold/20 shadow-[0_0_60px_rgba(201,169,98,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80"
              alt="Placeholder — Maradona, ícono de L'essentiel"
              fill
              priority
              className="object-cover object-top grayscale-[30%] sepia-[20%]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
              <p className="font-display text-lg italic text-gold-light">
                &ldquo;La pelota no se mancha&rdquo;
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-ivory/50">
                — Diego Armando Maradona
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <Link
          href="#stock"
          className="flex flex-col items-center gap-2 text-ivory/40 transition-colors hover:text-gold"
          aria-label="Ir al catálogo"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">
            Descubrir
          </span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </Link>
      </motion.div>
    </section>
  );
}
