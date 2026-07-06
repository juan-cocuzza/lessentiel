"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#stock", label: "Stock Inmediato" },
  { href: "#encargo", label: "Pedidos por Encargo" },
  { href: "#seguimiento", label: "Seguimiento" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        isScrolled
          ? "border-b border-white/10 bg-charcoal/95 py-3 shadow-lg backdrop-blur-md"
          : "bg-transparent py-5"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex flex-col">
          <span className="font-display text-2xl font-semibold tracking-tight text-ivory transition-colors group-hover:text-gold sm:text-3xl">
            L&apos;essentiel
          </span>
          <span className="label-caps mt-0.5 text-[10px] sm:text-xs">
            Botines de Fútbol
          </span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium uppercase tracking-widest text-ivory/70 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </nav>

      <div
        className={cn(
          "glass-panel overflow-hidden transition-all duration-300 lg:hidden",
          isMobileOpen ? "max-h-96 border-t border-white/10" : "max-h-0"
        )}
      >
        <ul className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="block rounded-sm px-3 py-3 text-sm font-medium uppercase tracking-widest text-ivory/80 transition-colors hover:bg-white/5 hover:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
