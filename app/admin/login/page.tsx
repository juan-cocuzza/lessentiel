"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Contraseña incorrecta.");
        return;
      }

      const nextPath = new URLSearchParams(window.location.search).get("next");
      const destination = nextPath?.startsWith("/admin/") || nextPath === "/admin"
        ? nextPath
        : "/admin";
      router.replace(destination);
      router.refresh();
    } catch {
      setError("No se pudo conectar con el panel. Intentá nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B] p-4 text-ivory">
      <div className="w-full max-w-md rounded-md border border-gold/30 bg-charcoal-100/90 p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
            <Lock className="h-7 w-7" />
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-gold">L&apos;essentiel · Atelier</p>
          <h1 className="mt-1 font-display text-2xl font-bold">Panel de Administración</h1>
          <p className="mt-2 text-xs text-ivory/60">Ingresá la contraseña para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label htmlFor="admin-password" className="block text-[11px] font-semibold uppercase tracking-wider text-ivory/70">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-sm border border-white/15 bg-charcoal-50 px-4 py-3 pr-11 text-sm text-ivory outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              autoComplete="current-password"
              autoFocus
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-gold"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && <p className="text-xs text-red-300">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            <KeyRound className="h-4 w-4" />
            {isLoading ? "Verificando..." : "Ingresar al panel"}
          </Button>
        </form>
      </div>
    </div>
  );
}
