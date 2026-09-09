import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const mpAccessToken = process.env.MP_ACCESS_TOKEN;

if (!mpAccessToken && process.env.NODE_ENV !== "production") {
  console.warn(
    "⚠️ [Mercado Pago] Falta configurar MP_ACCESS_TOKEN en las variables de entorno (.env.local)."
  );
}

export const mpConfig = new MercadoPagoConfig({
  accessToken:
    mpAccessToken || "TEST-0000000000000000-000000-00000000000000000000000000000000-000000000",
  options: {
    timeout: 10000,
  },
});

export const preferenceClient = new Preference(mpConfig);
export const paymentClient = new Payment(mpConfig);

