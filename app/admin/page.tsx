"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  ClipboardList,
  PackageSearch,
  Settings,
  Shirt,
  Users,
} from "lucide-react";
import { useProducts } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const sections = [
  {
    title: "Pedidos",
    href: "/admin/orders",
    icon: ClipboardList,
    tone: "text-sky-300",
    description: "Seguimiento y estados de cada compra.",
  },
  {
    title: "Catálogo",
    href: "/admin/catalog",
    icon: Shirt,
    tone: "text-gold",
    description: "Modelos, precios, talles y disponibilidad.",
  },
  {
    title: "Encargos",
    href: "/admin/requests",
    icon: PackageSearch,
    tone: "text-amber-300",
    description: "Reservas con seña del 50% y producción.",
  },
  {
    title: "Clientes",
    href: "/admin/customers",
    icon: Users,
    tone: "text-emerald-300",
    description: "Historial y datos de compradores.",
  },
  {
    title: "Métricas",
    href: "/admin/metrics",
    icon: BarChart3,
    tone: "text-violet-300",
    description: "Rendimiento, ventas y conversión.",
  },
  {
    title: "Configuración",
    href: "/admin/settings",
    icon: Settings,
    tone: "text-ivory/70",
    description: "Pagos, notificaciones y preferencias.",
  },
];

export default function AdminDashboardPage() {
  const { products } = useProducts();
  const [activeOrders, setActiveOrders] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadActiveOrders() {
      const { data } = await supabase
        .from("orders")
        .select("status")
        .neq("status", "final-del-juego");
      if (isMounted) setActiveOrders(data?.length ?? 0);
    }

    loadActiveOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const preorderCount = products.filter((product) => product.is_by_request).length;

  return (
    <div className="section-padding mx-auto max-w-7xl">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-caps">Centro de operaciones</p>
          <h1 className="heading-section mt-2">Bienvenido al Atelier</h1>
          <p className="mt-3 max-w-xl text-sm text-ivory/60">
            Todo lo esencial para administrar la colección y acompañar cada pedido.
          </p>
        </div>
        <Link href="/" className="text-xs font-semibold uppercase tracking-wider text-gold hover:underline">
          Ver tienda <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Pedidos activos" value={activeOrders === null ? "..." : String(activeOrders)} detail="En proceso o pendientes" />
        <SummaryCard label="Botines en catálogo" value={String(products.length)} detail="Datos sincronizados" />
        <SummaryCard label="Encargos abiertos" value={String(preorderCount)} detail="Seña inicial del 50%" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map(({ title, href, icon: Icon, tone, description }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-sm border border-white/10 bg-charcoal-50/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_12px_40px_rgba(201,169,98,0.12)]"
          >
            <div className="flex items-start justify-between">
              <Icon className={cn("h-6 w-6", tone)} />
              <ArrowUpRight className="h-4 w-4 text-ivory/30 transition-colors group-hover:text-gold" />
            </div>
            <h2 className="mt-8 font-display text-2xl text-ivory">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ivory/55">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="border-l-2 border-gold/70 bg-charcoal-50/60 px-5 py-4">
      <p className="text-xs uppercase tracking-wider text-ivory/45">{label}</p>
      <p className="mt-2 font-display text-3xl text-gold">{value}</p>
      <p className="mt-1 text-xs text-ivory/45">{detail}</p>
    </div>
  );
}
