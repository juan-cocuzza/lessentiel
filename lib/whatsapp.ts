import { OrderRow, OrderStatus } from "./supabase";
import { formatPrice } from "./utils";

/**
 * Obtiene el nombre del modelo o modelos de botines de la orden
 */
export function getOrderBootModels(order: OrderRow): string {
  if (Array.isArray(order.items) && order.items.length > 0) {
    const names = order.items
      .map((item: any) => item?.name || item?.title)
      .filter(Boolean);
    if (names.length > 0) {
      return names.join(", ");
    }
  }
  return "L'essentiel";
}

/**
 * Genera el mensaje prediseñado con tono futbolero prémium según el estado actual de la orden
 */
export function generateWhatsAppMessage(
  order: OrderRow,
  trackingUrl: string
): string {
  const customerFirstName = order.customer_name
    ? order.customer_name.trim().split(" ")[0]
    : "Crack";
  const bootModel = getOrderBootModels(order);
  const remainingBalanceFormatted = formatPrice(
    Math.round(Number(order.total_amount) * 0.5)
  );

  switch (order.status) {
    case "entrada-en-calor":
      return `¡Hola ${customerFirstName}! ⚽ Arrancó el partido para tus botines *${bootModel}*. Tu pedido ya está en *Entrada en Calor* (seña confirmada). El equipo de L'essentiel comenzó la confección y preparación de tu par. Podés seguir el minuto a minuto acá: ${trackingUrl}`;

    case "en-cancha":
      return `¡Hola ${customerFirstName}! ✈️⚽ Tus botines *${bootModel}* pasaron al estado: *En Cancha*. Tu par ya está en pleno juego, viajando en tránsito internacional directo hacia nuestro vestuario. Seguí la jugada acá: ${trackingUrl}`;

    case "en-vestuario":
      return `¡Hola ${customerFirstName}! 👟🛡️ Tus botines *${bootModel}* acaban de llegar al estado: *En el Vestuario*. Pasaron con éxito nuestro riguroso control de calidad artesanal. Ya podés abonar el saldo restante (${remainingBalanceFormatted}) para coordinar el despacho final a tu domicilio: ${trackingUrl}`;

    case "tiempo-de-descuento":
      return `¡Hola ${customerFirstName}! ⏱️⚽ ¡Entramos en *Tiempo de Descuento* para tus botines *${bootModel}*! Tu par está 100% listo para salir a la cancha. Aboná el saldo pendiente (${remainingBalanceFormatted}) para que realicemos el despacho inmediato a tu casa: ${trackingUrl}`;

    case "final-del-juego":
      return `¡Hola ${customerFirstName}! 🏆⚽ ¡*Final del Juego* y victoria total! Tus botines *${bootModel}* ya fueron despachados / entregados. ¡Preparate para ponértelos y romperla en la cancha! Muchas gracias por confiar en la distinción de L'essentiel.`;

    default:
      return `¡Hola ${customerFirstName}! Te contactamos de *L'essentiel* respecto a tu pedido de botines *${bootModel}*. Podés consultar el estado actualizado acá: ${trackingUrl}`;
  }
}

/**
 * Limpia y normaliza un número de teléfono para wa.me (remueve +, guiones, espacios)
 */
export function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

/**
 * Genera el enlace de wa.me con el texto pre-cargado
 */
export function getWhatsAppUrl(
  order: OrderRow,
  trackingUrl: string,
  phoneOverride?: string
): string {
  const message = generateWhatsAppMessage(order, trackingUrl);
  const rawPhone = phoneOverride || (order as any).customer_phone || "";
  const cleaned = cleanPhoneNumber(rawPhone);

  const encodedText = encodeURIComponent(message);
  if (cleaned) {
    return `https://wa.me/${cleaned}?text=${encodedText}`;
  }
  return `https://wa.me/?text=${encodedText}`;
}

