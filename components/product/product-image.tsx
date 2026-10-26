import Image, { type ImageProps } from "next/image";
import { canOptimizeProductImage } from "@/lib/product-images";

/** Optimize known public hosts, preserving legacy external and local preview URLs. */
export function ProductImage({ src, alt, ...props }: Omit<ImageProps, "src" | "unoptimized"> & { src: string }) {
  return <Image {...props} alt={alt} src={src} unoptimized={!canOptimizeProductImage(src)} />;
}
