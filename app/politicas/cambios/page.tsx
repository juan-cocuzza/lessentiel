import Link from "next/link";

export const metadata = {
  title: "Política de cambios",
};

export default function ChangesPage() {
  return (
    <article className="section-padding mx-auto max-w-3xl">
      <p className="label-caps text-gold">L&apos;essentiel</p>
      <h1 className="heading-section mt-3">Política de cambios</h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-ivory/70">
        <p>Los cambios se solicitan dentro de los 10 días corridos desde la recepción, con el producto sin uso y en su embalaje original.</p>
        <p>Los botines por encargo se fabrican según el talle confirmado y no admiten cambios por elección incorrecta de medida. Consultá la guía antes de reservar.</p>
        <p>Para iniciar una gestión escribinos a contacto@lessentiel.com indicando el número de pedido y el motivo del cambio.</p>
      </div>
      <Link href="/" className="mt-8 inline-block text-sm text-gold hover:underline">Volver al catálogo</Link>
    </article>
  );
}
