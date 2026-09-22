import Link from "next/link";
import { Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer id="contacto" className="border-t border-white/10 bg-charcoal-100">
      <div className="section-padding mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-semibold text-ivory">
              L&apos;essentiel
            </p>
            <p className="mt-2 text-sm text-ivory/60">
              El alma de tus pies. Botines premium con la esencia de Maradona.
            </p>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-gold/80">
              Los modelos por encargo se reservan con una seña del 50%. El saldo
              se abona antes del despacho.
            </p>
          </div>

          <div>
            <p className="label-caps mb-4">Contacto</p>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li>
                <a
                  href="mailto:contacto@lessentiel.com"
                  className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <Mail className="h-4 w-4" />
                  contacto@lessentiel.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <Instagram className="h-4 w-4" />
                  @lessentiel.boots
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="label-caps mb-4">Legal</p>
            <ul className="space-y-2 text-sm text-ivory/60">
              <li>
                <Link href="/politicas/terminos" className="hover:text-gold">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/politicas/cambios" className="hover:text-gold">
                  Política de cambios
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="font-display text-lg italic text-gold">
            La pelota no se mancha.
          </p>
          <p suppressHydrationWarning className="mt-4 text-xs text-ivory/40">
          © {new Date().getFullYear()} L&apos;essentiel. Todos los derechos
          reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
