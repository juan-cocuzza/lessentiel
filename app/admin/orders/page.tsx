"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  Flame,
  Plane,
  ShieldCheck,
  Timer,
  Trophy,
  Check,
  AlertCircle,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Copy,
  ChevronDown,
  Clock,
  ArrowRight,
} from "lucide-react";
import { supabase, type OrderRow, type OrderStatus } from "@/lib/supabase";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Lista de estados disponibles en el orden cronológico del partido
const STATUS_OPTIONS: {
  id: OrderStatus;
  label: string;
  minute: string;
  icon: React.ElementType;
  badgeClass: string;
}[] = [
  {
    id: "entrada-en-calor",
    label: "Entrada en Calor",
    minute: "00'",
    icon: Flame,
    badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
  {
    id: "en-cancha",
    label: "En Cancha (Importándose)",
    minute: "45'",
    icon: Plane,
    badgeClass: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  },
  {
    id: "en-vestuario",
    label: "En el Vestuario (Control Calidad)",
    minute: "80'",
    icon: ShieldCheck,
    badgeClass: "border-purple-500/30 bg-purple-500/10 text-purple-300",
  },
  {
    id: "tiempo-de-descuento",
    label: "Tiempo de Descuento (Saldo Pendiente)",
    minute: "90+3'",
    icon: Timer,
    badgeClass: "border-gold/40 bg-gold/15 text-gold-light font-semibold",
  },
  {
    id: "final-del-juego",
    label: "Final del Juego (Enviado / Entregado)",
    minute: "FT",
    icon: Trophy,
    badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
];

export default function AdminOrdersPage() {
  // 1. Estado de autenticación básica
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // 2. Estado de órdenes y carga
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 3. Modal de notificación de saldo enviada
  const [notifiedOrder, setNotifiedOrder] = useState<OrderRow | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // 4. Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Contraseña configurada en .env o fallback por defecto
  const expectedPassword =
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    process.env.ADMIN_PASSWORD ||
    "lessentiel2026";

  // Verificar si ya está autenticado en la sesión actual
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("lessentiel_admin_auth");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Función para obtener todas las órdenes ordenadas por created_at desc
  const fetchOrders = React.useCallback(async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    setIsRefreshing(true);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (err: any) {
      console.error("Error al cargar órdenes:", err);
      showToast("Error al conectar con Supabase para cargar órdenes.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Cargar órdenes cuando se autentique
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  // Mensajes temporales tipo Toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Manejar Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (passwordInput === expectedPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("lessentiel_admin_auth", "true");
    } else {
      setAuthError("Contraseña incorrecta. Verificá la clave configurada en .env");
    }
  };

  // Manejar Logout
  const handleLogout = () => {
    sessionStorage.removeItem("lessentiel_admin_auth");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  // Actualizar estado de una orden en Supabase
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);

    // Actualización optimista en memoria
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) {
        throw error;
      }

      const statusObj = STATUS_OPTIONS.find((s) => s.id === newStatus);
      showToast(`✓ Orden #${orderId.slice(0, 8)} actualizada a: ${statusObj?.label}`);
    } catch (err: any) {
      console.error("Error actualizando estado:", err);
      showToast("No se pudo actualizar el estado en Supabase.");
      // Revertir recargando de la base
      fetchOrders(true);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // REQUISITO: Botón 'Notificar Saldo'
  // Pasa el estado a 'tiempo-de-descuento', habilitando en la pantalla del cliente el botón para pagar el 50% restante
  const handleNotifyBalance = async (order: OrderRow) => {
    setUpdatingOrderId(order.id);

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "tiempo-de-descuento" })
        .eq("id", order.id);

      if (error) {
        throw error;
      }

      const updatedOrder = { ...order, status: "tiempo-de-descuento" as OrderStatus };

      // Actualizar estado local
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? updatedOrder : o))
      );

      // Abrir modal con detalles del aviso al cliente
      setNotifiedOrder(updatedOrder);
      showToast(`¡Saldo Notificado! Orden #${order.id.slice(0, 8)} en Tiempo de Descuento.`);
    } catch (err: any) {
      console.error("Error al notificar saldo:", err);
      showToast("Error al cambiar estado a Tiempo de Descuento.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filtrado de órdenes
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : order.status === statusFilter;

      const matchesType =
        typeFilter === "all"
          ? true
          : typeFilter === "preorder"
          ? order.is_preorder
          : !order.is_preorder;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, searchTerm, statusFilter, typeFilter]);

  // Contadores para métricas
  const stats = useMemo(() => {
    return {
      total: orders.length,
      preorders: orders.filter((o) => o.is_preorder).length,
      enCancha: orders.filter((o) => o.status === "en-cancha").length,
      enVestuario: orders.filter((o) => o.status === "en-vestuario").length,
      tiempoDescuento: orders.filter((o) => o.status === "tiempo-de-descuento").length,
      finalizadas: orders.filter((o) => o.status === "final-del-juego").length,
    };
  }, [orders]);

  // URL de seguimiento para compartir con el cliente
  const getTrackingUrl = (id: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/?orderId=${id}#seguimiento`;
    }
    return `https://lessentiel.com/?orderId=${id}#seguimiento`;
  };

  // -------------------------------------------------------------
  // PANTALLA 1: MODAL / LOGIN DE ACCESO CON CONTRASEÑA
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B] p-4 text-ivory">
        {/* Fondo sutil con resplandor dorado */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-md overflow-hidden rounded-md border border-gold/30 bg-charcoal-100/90 p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl"
        >
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold shadow-[0_0_20px_rgba(201,169,98,0.2)]">
              <Lock className="h-7 w-7" />
            </div>

            <p className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-gold">
              L&apos;essentiel • Dirección Técnica
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-wide text-ivory">
              Panel de Administración
            </h1>
            <p className="mt-2 text-xs text-ivory/60">
              Ingresá la contraseña de acceso protegida para gestionar los pedidos.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-[11px] font-semibold uppercase tracking-wider text-ivory/70 mb-1"
              >
                Contraseña Administrativa
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Ingresá ADMIN_PASSWORD"
                  className="w-full rounded-sm border border-white/15 bg-charcoal-50 px-4 py-2.5 pr-10 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-sm border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </motion.div>
            )}

            <Button type="submit" className="w-full gap-2 mt-2" size="lg">
              <KeyRound className="h-4 w-4" />
              Ingresar al Vestuario
            </Button>
          </form>

          <p className="mt-6 text-center text-[10px] text-ivory/40">
            Definida en variable de entorno{" "}
            <code className="text-gold font-mono">NEXT_PUBLIC_ADMIN_PASSWORD</code>
          </p>
        </motion.div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // PANTALLA 2: DASHBOARD DE ÓRDENES AUTENTICADO
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-ivory selection:bg-gold selection:text-charcoal pb-20">
      {/* Toast flotante */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-md border border-gold/40 bg-charcoal-50 px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-gold shrink-0 animate-pulse" />
            <p className="text-sm font-medium text-ivory">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barra de Navegación Superior */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-charcoal-100/90 backdrop-blur-md px-4 py-3.5 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 bg-gold/10 text-gold font-display font-bold">
              L
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold tracking-wider text-ivory text-base">
                  L&apos;ESSENTIEL
                </span>
                <span className="rounded-full bg-gold/15 px-2 py-0.2 text-[9px] font-semibold uppercase tracking-widest text-gold border border-gold/30">
                  Panel DT
                </span>
              </div>
              <p className="text-[10px] text-ivory/50">
                Gestión Integral de Órdenes y Minuto a Minuto
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => fetchOrders(true)}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 rounded-sm border border-white/10 bg-charcoal-50 px-3 py-1.5 text-xs text-ivory/80 transition hover:border-gold/40 hover:text-gold"
              title="Refrescar órdenes desde Supabase"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-gold")}
              />
              <span className="hidden sm:inline">
                {isRefreshing ? "Actualizando..." : "Refrescar"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-sm border border-white/10 bg-charcoal-50 px-3 py-1.5 text-xs text-ivory/60 transition hover:border-red-500/40 hover:text-red-400"
              title="Cerrar Sesión"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-8">
        {/* Métricas de Cabecera */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
          <div className="rounded-md border border-white/10 bg-charcoal-100/60 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ivory/50">
              Total Pedidos
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-ivory">
              {stats.total}
            </p>
          </div>

          <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
              Por Encargo
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-amber-300">
              {stats.preorders}
            </p>
          </div>

          <div className="rounded-md border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-400">
              En Cancha (Tránsito)
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-sky-300">
              {stats.enCancha}
            </p>
          </div>

          <div className="rounded-md border border-purple-500/20 bg-purple-500/5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
              En Vestuario (Revisión)
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-purple-300">
              {stats.enVestuario}
            </p>
          </div>

          <div className="rounded-md border border-gold/30 bg-gold/5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">
              Tiempo Descuento
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-gold-light">
              {stats.tiempoDescuento}
            </p>
          </div>

          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              Final del Juego
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-emerald-300">
              {stats.finalizadas}
            </p>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-md border border-white/10 bg-charcoal-100/60 p-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ivory/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, email o ID (#...)"
              className="w-full rounded-sm border border-white/10 bg-charcoal-50 pl-10 pr-4 py-2 text-xs text-ivory placeholder:text-ivory/30 focus:border-gold/60 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-ivory/60">
              <Filter className="h-3.5 w-3.5" />
              <span>Filtros:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-sm border border-white/10 bg-charcoal-50 px-3 py-2 text-xs text-ivory focus:border-gold/60 focus:outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="entrada-en-calor">🔥 Entrada en calor</option>
              <option value="en-cancha">✈️ En cancha</option>
              <option value="en-vestuario">🛡️ En vestuario</option>
              <option value="tiempo-de-descuento">⏱️ Tiempo de descuento</option>
              <option value="final-del-juego">🏆 Final del juego</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-sm border border-white/10 bg-charcoal-50 px-3 py-2 text-xs text-ivory focus:border-gold/60 focus:outline-none"
            >
              <option value="all">Todos los tipos</option>
              <option value="preorder">Por Encargo</option>
              <option value="stock">En Stock</option>
            </select>
          </div>
        </div>

        {/* Tabla / Lista de Órdenes */}
        <div className="mt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-md border border-white/10 bg-charcoal-100/40 p-16 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold mb-3" />
              <p className="text-sm font-display text-ivory">
                Cargando órdenes desde Supabase...
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-md border border-white/10 bg-charcoal-100/40 p-16 text-center">
              <p className="font-display text-lg text-ivory">
                No se encontraron pedidos
              </p>
              <p className="mt-1 text-xs text-ivory/50">
                {orders.length === 0
                  ? "Aún no hay pedidos registrados en la base de datos."
                  : "Probá ajustando el término de búsqueda o los filtros."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isUpdating = updatingOrderId === order.id;

                // Extraer productos y talles
                const itemsList = Array.isArray(order.items) && order.items.length > 0
                  ? order.items
                  : null;

                // Saldo restante (50% en preorder)
                const remainingBalance = Math.round(Number(order.total_amount) * 0.5);

                // REQUISITO: Si el estado es 'en-vestuario' y balance_paid es false, habilitar botón 'Notificar Saldo'
                const canNotifyBalance =
                  order.is_preorder &&
                  order.status === "en-vestuario" &&
                  !order.balance_paid;

                const currentStatusObj = STATUS_OPTIONS.find(
                  (s) => s.id === order.status
                );

                return (
                  <div
                    key={order.id}
                    className={cn(
                      "relative overflow-hidden rounded-md border transition-all duration-300 p-5 bg-charcoal-100/80 shadow-md",
                      canNotifyBalance
                        ? "border-gold/50 shadow-[0_0_20px_rgba(201,169,98,0.15)] ring-1 ring-gold/20"
                        : "border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Columna 1: Info del Pedido y Cliente */}
                      <div className="space-y-2 lg:max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gold">
                            #{order.id.slice(0, 8)}
                          </span>
                          <span className="text-[10px] text-ivory/40">
                            {new Date(order.created_at).toLocaleDateString(
                              "es-AR",
                              {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          {order.is_preorder ? (
                            <Badge variant="preorder">Por Encargo</Badge>
                          ) : (
                            <Badge variant="stock">Stock</Badge>
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-ivory text-base">
                            {order.customer_name}
                          </p>
                          <p className="text-xs text-ivory/60 font-mono">
                            {order.customer_email}
                          </p>
                        </div>
                      </div>

                      {/* Columna 2: Botines Seleccionados y Talles */}
                      <div className="space-y-1 lg:max-w-xs">
                        <p className="text-[10px] uppercase font-semibold tracking-wider text-ivory/40">
                          Botines y Talle
                        </p>
                        {itemsList ? (
                          <div className="space-y-1">
                            {itemsList.map((item: any, idx: number) => (
                              <div key={idx} className="text-xs text-ivory/90">
                                <span className="font-medium text-gold">
                                  {item.name || "Botín L'essentiel"}
                                </span>{" "}
                                {item.size && (
                                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-ivory/90 ml-1">
                                    Talle {item.size}
                                  </span>
                                )}
                                {item.quantity > 1 && (
                                  <span className="text-ivory/50 text-[10px] ml-1">
                                    x{item.quantity}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-ivory/70 italic">
                            Calzado artesanal L&apos;essentiel
                          </p>
                        )}
                      </div>

                      {/* Columna 3: Estado de Pagos (Seña / Saldo) */}
                      <div className="space-y-1.5 lg:min-w-[170px]">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-ivory/50">Total:</span>
                          <span className="font-display font-semibold text-ivory">
                            {formatPrice(Number(order.total_amount))}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-ivory/50">Seña (50%):</span>
                          {order.deposit_paid ? (
                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                              <Check className="h-3 w-3" /> Abonada
                            </span>
                          ) : (
                            <span className="text-amber-400 font-medium">
                              Pendiente
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-ivory/50">Saldo (50%):</span>
                          {order.balance_paid ? (
                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                              <Check className="h-3 w-3" /> Cancelado
                            </span>
                          ) : (
                            <span className="text-gold font-medium">
                              {order.is_preorder
                                ? `${formatPrice(remainingBalance)} pend.`
                                : "Pendiente"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Columna 4: Select de Estado de Tracking y Botón Notificar */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:min-w-[320px]">
                        <div className="flex-1">
                          <label className="block text-[10px] uppercase font-semibold tracking-wider text-ivory/40 mb-1">
                            Minuto a Minuto (Tracking)
                          </label>
                          <div className="relative">
                            <select
                              value={order.status}
                              disabled={isUpdating}
                              onChange={(e) =>
                                handleStatusChange(
                                  order.id,
                                  e.target.value as OrderStatus
                                )
                              }
                              className={cn(
                                "w-full appearance-none rounded-sm border px-3 py-2 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-gold pr-8 cursor-pointer",
                                currentStatusObj?.badgeClass ||
                                  "border-white/10 bg-charcoal-50 text-ivory",
                                isUpdating && "opacity-50 pointer-events-none"
                              )}
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option
                                  key={opt.id}
                                  value={opt.id}
                                  className="bg-charcoal text-ivory"
                                >
                                  [{opt.minute}] {opt.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ivory/50" />
                          </div>
                        </div>

                        {/* REQUISITO: Botón 'Notificar Saldo' */}
                        {canNotifyBalance && (
                          <div className="pt-4 sm:pt-4">
                            <Button
                              onClick={() => handleNotifyBalance(order)}
                              disabled={isUpdating}
                              size="sm"
                              className="w-full sm:w-auto gap-1.5 bg-gradient-to-r from-gold to-gold-light text-charcoal shadow-[0_0_20px_rgba(201,169,98,0.4)] hover:shadow-[0_0_30px_rgba(201,169,98,0.6)] animate-pulse"
                            >
                              <Timer className="h-3.5 w-3.5" />
                              <span>Notificar Saldo</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Confirmación: Saldo Notificado y Enlace de Pago */}
      <AnimatePresence>
        {notifiedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-md border border-gold/50 bg-charcoal-100 p-6 shadow-[0_10px_50px_rgba(0,0,0,0.9)] text-ivory"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-gold border border-gold/40">
                  <Timer className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-ivory">
                    ¡Orden en Tiempo de Descuento!
                  </h3>
                  <p className="text-xs text-gold">
                    Saldo restante habilitado para abonar con Mercado Pago
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 rounded-sm border border-white/10 bg-charcoal-50 p-4 text-xs">
                <p className="text-ivory/80 leading-relaxed">
                  El pedido <strong className="text-gold">#{notifiedOrder.id.slice(0, 8)}</strong> de{" "}
                  <strong>{notifiedOrder.customer_name}</strong> pasó a la etapa{" "}
                  <span className="font-semibold text-gold">Tiempo de Descuento</span>.
                </p>
                <p className="text-ivory/60">
                  En su pantalla de seguimiento, ahora tiene visible el botón para pagar el{" "}
                  <strong>50% restante ({formatPrice(Math.round(Number(notifiedOrder.total_amount) * 0.5))})</strong>.
                </p>

                <div className="border-t border-white/10 pt-3">
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-ivory/50 mb-1">
                    Enlace de seguimiento del cliente:
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={getTrackingUrl(notifiedOrder.id)}
                      className="flex-1 rounded-sm border border-white/10 bg-charcoal px-3 py-1.5 font-mono text-[11px] text-ivory/80 focus:outline-none"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(getTrackingUrl(notifiedOrder.id));
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="gap-1 text-xs shrink-0"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `¡Hola ${notifiedOrder.customer_name}! Tus botines ya llegaron al vestuario de L'essentiel y pasaron el control de calidad. Ya podés abonar el saldo restante para el despacho final acá: ${getTrackingUrl(
                      notifiedOrder.id
                    )}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-sm bg-emerald-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-emerald-500 transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enviar por WhatsApp
                </a>

                <Button
                  onClick={() => setNotifiedOrder(null)}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Entendido
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
