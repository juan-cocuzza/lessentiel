import type { Metadata } from "next";
import { ProductDetail } from "@/components/product/product-detail";
import { getProductsWithFallback } from "@/lib/products";
import { siteDescription, siteTitle } from "@/lib/site-metadata";

interface ProductPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  // Match the same catalog and fallback rules used by the interactive page.
  const { products } = await getProductsWithFallback();
  const product = products.find((item) => item.id === params.id || item.slug === params.id);
  const title = product ? `${product.name} - Botines de Fútbol Premium` : "Botines de Fútbol Premium";
  const description = product
    ? `${product.description} ${product.is_by_request || product.availability === "preorder" ? "Disponible por encargo con seña del 50%." : "Stock inmediato."} Descubrí tu talle en L'essentiel.`
    : siteDescription;
  const url = `/products/${encodeURIComponent(product?.id || params.id)}`;
  const image = product?.images?.[0] || product?.image;
  const images = image && (image.startsWith("https://") || image.startsWith("/"))
    ? [{ url: image, alt: product?.name || siteTitle }]
    : [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: siteTitle }];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | L'essentiel`, description, url, type: "website", locale: "es_AR", siteName: "L'essentiel", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetail key={params.id} productId={params.id} />;
}
