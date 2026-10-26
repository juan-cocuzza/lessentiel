export const siteTitle = "L'essentiel - Botines de Fútbol Premium";
export const siteDescription =
  "Descubrí botines de fútbol premium en L'essentiel. Modelos con stock inmediato y pedidos exclusivos por encargo, guía de talles y envíos a toda Argentina.";

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
);
