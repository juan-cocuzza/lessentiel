import Link from "next/link";

export default function AdminRequestsPage() {
  return <Section title="Encargos" description="Reservas con seña del 50% y seguimiento de producción." />;
}

function Section({ title, description }: { title: string; description: string }) {
  return <div className="section-padding mx-auto max-w-5xl"><p className="label-caps">Administración</p><h1 className="heading-section mt-2">{title}</h1><p className="mt-3 text-sm text-ivory/60">{description}</p><div className="mt-8 border border-white/10 bg-charcoal-50/60 p-6 text-sm text-ivory/60">Esta sección está lista para conectarse con las operaciones del atelier.</div><Link href="/admin" className="mt-6 inline-block text-xs font-semibold uppercase tracking-wider text-gold hover:underline">Volver al inicio</Link></div>;
}
