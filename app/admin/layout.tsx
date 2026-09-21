"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Boxes,
  ChevronDown,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  PackageSearch,
  Settings,
  Shirt,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Inicio", href: "/admin", icon: Home },
  { label: "Pedidos", href: "/admin/orders", icon: ClipboardList },
  { label: "Catálogo", href: "/admin/catalog", icon: Shirt },
  { label: "Encargos", href: "/admin/requests", icon: PackageSearch },
  { label: "Clientes", href: "/admin/customers", icon: Users },
  { label: "Métricas", href: "/admin/metrics", icon: BarChart3 },
  { label: "Configuración", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsMobileOpen(false);
    router.replace("/admin/login");
    router.refresh();
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-white/10 bg-charcoal-100 p-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <Link href="/admin" onClick={() => setIsMobileOpen(false)}>
          <p className="font-display text-2xl font-semibold text-ivory">L&apos;essentiel</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">Atelier · Admin</p>
        </Link>
        <button
          type="button"
          aria-label="Cerrar menú"
          className="rounded-sm p-2 text-ivory/60 hover:bg-white/5 hover:text-gold lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-8 flex-1 space-y-1" aria-label="Navegación del panel">
        {navigation.map(({ label, href, icon: Icon }) => {
          const isActive = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gold/15 text-gold"
                  : "text-ivory/60 hover:bg-white/5 hover:text-ivory"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 border-t border-white/10 px-3 pt-5 text-sm font-medium text-ivory/50 transition-colors hover:text-red-300"
      >
        <LogOut className="h-4 w-4" />
        Cerrar Sesión
      </button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-charcoal text-ivory">
      <div className="flex min-h-screen">
        <div className="fixed inset-y-0 left-0 z-50 hidden lg:block">{sidebar}</div>
        <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-charcoal/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            <button
              type="button"
              aria-label="Abrir menú"
              className="rounded-sm p-2 text-ivory/70 hover:bg-white/5 hover:text-gold lg:hidden"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="ml-auto flex items-center gap-2 text-xs uppercase tracking-wider text-ivory/40">
              <Boxes className="h-4 w-4 text-gold" />
              Panel de control
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative h-full">{sidebar}</div>
        </div>
      )}
    </div>
  );
}
