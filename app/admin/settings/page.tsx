"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

const settingsKey = "lessentiel_admin_settings";
const defaults = { cbu: "", alias: "lessentiel", bank: "", holder: "", deposit: "50", maintenance: false };
type Settings = typeof defaults;

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [saved, setSaved] = useState(false);
  useEffect(() => { const stored = localStorage.getItem(settingsKey); if (stored) setSettings({ ...defaults, ...JSON.parse(stored) }); }, []);
  function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); localStorage.setItem(settingsKey, JSON.stringify(settings)); setSaved(true); window.setTimeout(() => setSaved(false), 2500); }
  return <div className="section-padding mx-auto max-w-4xl"><div className="mb-8"><p className="label-caps">Control del atelier</p><h1 className="heading-section mt-2">Configuración</h1><p className="mt-3 text-sm text-ivory/60">Datos de transferencia, señas y estado público de la tienda.</p></div><form onSubmit={save} className="space-y-6"><section className="border border-white/10 bg-charcoal-50/60 p-5"><h2 className="font-display text-xl text-ivory">Datos de transferencia</h2><p className="mt-2 text-xs text-ivory/50">Se muestran al cliente durante el checkout por transferencia.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="CBU" value={settings.cbu} onChange={(cbu) => setSettings({ ...settings, cbu })} /><Field label="Alias" value={settings.alias} onChange={(alias) => setSettings({ ...settings, alias })} /><Field label="Banco" value={settings.bank} onChange={(bank) => setSettings({ ...settings, bank })} /><Field label="Titular" value={settings.holder} onChange={(holder) => setSettings({ ...settings, holder })} /></div></section><section className="border border-white/10 bg-charcoal-50/60 p-5"><h2 className="font-display text-xl text-ivory">Reglas comerciales</h2><div className="mt-5 max-w-xs"><label className="field-label">Seña por defecto (%)</label><input type="number" min="1" max="99" value={settings.deposit} onChange={(e) => setSettings({ ...settings, deposit: e.target.value })} className="field-input" /></div></section><section className="flex items-center justify-between border border-amber-400/20 bg-amber-400/5 p-5"><div><h2 className="font-display text-xl text-ivory">Modo mantenimiento</h2><p className="mt-1 text-xs text-ivory/55">Dejá la tienda preparada para una pausa operativa.</p></div><button type="button" role="switch" aria-checked={settings.maintenance} onClick={() => setSettings({ ...settings, maintenance: !settings.maintenance })} className={`relative h-7 w-12 rounded-full transition-colors ${settings.maintenance ? "bg-gold" : "bg-white/15"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-ivory transition-transform ${settings.maintenance ? "translate-x-6" : "translate-x-1"}`} /></button></section><Button type="submit"><Save className="h-4 w-4" />Guardar configuración</Button>{saved && <span className="ml-4 inline-flex items-center gap-1 text-xs text-emerald-300"><Check className="h-4 w-4" />Guardado</span>}</form></div>;
}
function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label><span className="field-label">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} className="field-input" /></label>; }
