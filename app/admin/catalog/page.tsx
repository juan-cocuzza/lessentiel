"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { Edit3, Plus, Power, X } from "lucide-react";
import { getProductsWithFallback } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const defaultForm = { name: "", description: "", price: "", sizes: "39, 40, 41, 42, 43, 44", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", is_by_request: false };
type FormState = typeof defaultForm;

export default function AdminCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => { getProductsWithFallback().then(({ products: loaded }) => { setProducts(loaded); setIsLoading(false); }); }, []);
  function openCreate() { setEditingProduct(null); setForm(defaultForm); setIsCreating(true); }
  function openEdit(product: Product) { setEditingProduct(product); setIsCreating(false); setForm({ name: product.name, description: product.description, price: String(product.price), sizes: product.sizes.join(", "), image: product.image, is_by_request: Boolean(product.is_by_request) }); }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = Number(form.price);
    const sizes = form.sizes.split(",").map(Number).filter((size) => size > 0);
    if (!form.name.trim() || !price || !sizes.length) return;
    const payload = { name: form.name.trim(), description: form.description.trim(), price, sizes: sizes.map(String), images: [form.image], is_by_request: form.is_by_request, stock_quantity: form.is_by_request ? 0 : 10 };
    if (editingProduct) {
      const updated = { ...editingProduct, ...payload, sizes, image: form.image, images: [form.image], availability: form.is_by_request ? "preorder" : "stock" } as Product;
      setProducts((current) => current.map((product) => product.id === editingProduct.id ? updated : product));
      const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
      setMessage(error ? "Guardado localmente; Supabase rechazó la edición." : "Producto actualizado.");
    } else {
      const localProduct: Product = { ...payload, active: true, id: `local-${Date.now()}`, brand: "L'essentiel", slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), image: form.image, images: [form.image], sizes, availability: form.is_by_request ? "preorder" : "stock", category: "modernos", featured: false, stock_quantity: payload.stock_quantity, specs: { sole_type: "FG (Césped Natural)", upper_material: "Sintético ultra-liviano", weight: "195g" } };
      setProducts((current) => [localProduct, ...current]);
      const { error } = await supabase.from("products").insert(payload);
      setMessage(error ? "Creado localmente; configurá permisos de escritura en Supabase para persistirlo." : "Producto creado.");
    }
    setEditingProduct(null); setIsCreating(false);
  }

  async function toggleProduct(product: Product) {
    const isByRequest = !product.is_by_request;
    const active = product.active === false;
    setProducts((current) => current.map((item) => item.id === product.id ? { ...item, active } : item));
    const { error } = await supabase.from("products").update({ active }).eq("id", product.id);
    setMessage(error ? "Estado actualizado localmente; Supabase rechazó la escritura." : "Estado actualizado.");
  }

  return <div className="section-padding mx-auto max-w-7xl"><div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="label-caps">Inventario</p><h1 className="heading-section mt-2">Catálogo</h1><p className="mt-3 text-sm text-ivory/60">Administrá precios, talles, descripciones y disponibilidad.</p></div><Button onClick={openCreate}><Plus className="h-4 w-4" />Nuevo botín</Button></div>{message && <p className="mb-4 border border-gold/30 bg-gold/10 px-4 py-3 text-xs text-gold">{message}</p>}<div className="overflow-x-auto rounded-sm border border-white/10 bg-charcoal-50/60"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-gold"><tr><th className="px-4 py-3">Producto</th><th className="px-4 py-3">Precio ARS</th><th className="px-4 py-3">Tipo</th><th className="px-4 py-3">Seña</th><th className="px-4 py-3">Activo</th><th /></tr></thead><tbody className="divide-y divide-white/5">{isLoading ? <tr><td colSpan={6} className="px-4 py-10 text-center text-ivory/50">Cargando catálogo...</td></tr> : products.map((product) => <tr key={product.id} className="hover:bg-white/[0.03]"><td className="flex items-center gap-3 px-4 py-3"><Image src={product.image} alt="" width={48} height={48} className="h-12 w-12 rounded-sm object-cover" /><div><p className="font-medium text-ivory">{product.name}</p><p className="text-xs text-ivory/45">Talles {product.sizes.join(", ")}</p></div></td><td className="px-4 py-3 text-gold">{formatPrice(product.price)}</td><td className="px-4 py-3 text-ivory/70">{product.is_by_request ? "Por Encargo" : "Stock"}</td><td className="px-4 py-3 text-ivory/70">{product.is_by_request ? `50% · ${formatPrice(Math.round(product.price / 2))}` : "-"}</td><td className="px-4 py-3"><button type="button" onClick={() => toggleProduct(product)} className={product.is_by_request ? "text-amber-300" : "text-emerald-300"} aria-label="Cambiar disponibilidad"><Power className="h-5 w-5" /></button></td><td className="px-4 py-3 text-right"><button type="button" onClick={() => openEdit(product)} className="text-ivory/50 hover:text-gold" aria-label={`Editar ${product.name}`}><Edit3 className="h-4 w-4" /></button></td></tr>)}</tbody></table></div>{(isCreating || editingProduct) && <ProductModal form={form} setForm={setForm} onSubmit={saveProduct} onClose={() => { setEditingProduct(null); setIsCreating(false); }} title={editingProduct ? "Editar botín" : "Nuevo botín"} />}</div>;
}

function ProductModal({ form, setForm, onSubmit, onClose, title }: { form: FormState; setForm: (form: FormState) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onClose: () => void; title: string }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><form onSubmit={onSubmit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-gold/30 bg-charcoal-100 p-6 shadow-2xl"><div className="mb-6 flex items-center justify-between"><h2 className="font-display text-2xl text-ivory">{title}</h2><button type="button" onClick={onClose} aria-label="Cerrar"><X className="h-5 w-5 text-ivory/60" /></button></div><div className="grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><span className="field-label">Nombre</span><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="field-input" /></label><label className="sm:col-span-2"><span className="field-label">Descripción</span><textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="field-input min-h-28" /></label><label><span className="field-label">Precio ARS</span><input required type="number" min="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="field-input" /></label><label><span className="field-label">Talles separados por coma</span><input required value={form.sizes} onChange={(event) => setForm({ ...form, sizes: event.target.value })} className="field-input" /></label><label className="sm:col-span-2"><span className="field-label">URL de imagen</span><input required type="url" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} className="field-input" /></label><label className="flex items-center gap-3 text-sm text-ivory/70 sm:col-span-2"><input type="checkbox" checked={form.is_by_request} onChange={(event) => setForm({ ...form, is_by_request: event.target.checked })} className="accent-gold" />Producto por encargo con seña del 50%</label></div><Button type="submit" className="mt-6 w-full">Guardar producto</Button></form></div>;
}
