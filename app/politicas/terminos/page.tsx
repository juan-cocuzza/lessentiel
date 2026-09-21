import Link from "next/link";

export const metadata = {
  title: "Términos y condiciones",
};

export default function TermsPage() {
  return (
    <article className="section-padding mx-auto max-w-3xl">
      <p className="label-caps text-gold">L&apos;essentiel</p>
      <h1 className="heading-section mt-3">Términos y condiciones</h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-ivory/70">
        <p>Las compras quedan sujetas a disponibilidad de talle, confirmación de pago y validación de los datos de entrega.</p>
        <p>Los modelos por encargo se producen especialmente para cada cliente y comienzan su fabricación una vez acreditada la seña del 50%.</p>
        <p>El saldo restante se abona antes del despacho. Los plazos informados son estimativos y pueden variar según el modelo.</p>
      </div>
      <Link href="/" className="mt-8 inline-block text-sm text-gold hover:underline">Volver al catálogo</Link>
    </article>
  );
}
