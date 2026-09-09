import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { paymentClient } from "@/lib/mercadopago";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    let body: any = {};

    try {
      body = await req.json();
    } catch {
      // En caso de que el webhook no envíe body JSON o venga en URL search params
      body = {};
    }

    // 1. Extraer ID del evento y tipo de recurso
    // Mercado Pago puede notificar vía body JSON o query params
    const type =
      body?.type ||
      body?.topic ||
      url.searchParams.get("type") ||
      url.searchParams.get("topic");

    const paymentId =
      body?.data?.id ||
      body?.id ||
      url.searchParams.get("data.id") ||
      url.searchParams.get("id");

    console.log(`[Mercado Pago Webhook] Notificación recibida:`, {
      type,
      paymentId,
      action: body?.action,
    });

    // Si la notificación no es de tipo 'payment', respondemos 200 para dar acuse de recibo
    if (type !== "payment" || !paymentId) {
      return NextResponse.json(
        { received: true, message: "Evento ignorado (no es de tipo payment o falta ID)." },
        { status: 200 }
      );
    }

    // 2. Consultar el pago en la API de Mercado Pago usando el SDK oficial
    let payment;
    try {
      payment = await paymentClient.get({ id: String(paymentId) });
    } catch (mpError: any) {
      console.error(
        `[Mercado Pago Webhook] Error al consultar el pago ${paymentId}:`,
        mpError?.message || mpError
      );
      // Retornar 200 para evitar reintentos infinitos si el pago fue de prueba o ya no existe
      return NextResponse.json(
        { error: "No se pudo obtener información del pago desde Mercado Pago." },
        { status: 200 }
      );
    }

    if (!payment) {
      return NextResponse.json(
        { error: "Pago no encontrado." },
        { status: 200 }
      );
    }

    // 3. Obtener referencia de la orden (external_reference o metadata.order_id)
    const orderId =
      payment.external_reference ||
      (payment.metadata && (payment.metadata.order_id || payment.metadata.orderid));

    if (!orderId) {
      console.warn(
        `[Mercado Pago Webhook] El pago ${paymentId} no tiene external_reference ni metadata.order_id asociados.`
      );
      return NextResponse.json(
        { received: true, message: "Sin orden asociada en external_reference." },
        { status: 200 }
      );
    }

    // 4. Buscar la orden correspondiente en Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error(
        `[Mercado Pago Webhook] No se encontró la orden ${orderId} en Supabase:`,
        orderError?.message
      );
      return NextResponse.json(
        { error: "Orden no encontrada en la base de datos." },
        { status: 200 }
      );
    }

    const paymentStatus = payment.status;
    console.log(
      `[Mercado Pago Webhook] Estado del pago para orden #${order.id.slice(0, 8)}: ${paymentStatus}`
    );

    // 5. Procesar únicamente cuando el pago esté 'approved'
    if (paymentStatus === "approved") {
      const paymentTypeMeta = payment.metadata?.payment_type;

      // Determinamos si es pago de Seña o Saldo Final:
      // A) Si es pre-order y es la seña (o deposit_paid aún es false):
      const isDepositPayment =
        order.is_preorder &&
        (paymentTypeMeta === "deposit" || !order.deposit_paid);

      // B) Si es pre-order y es el saldo final (deposit ya pagado o marcado como balance):
      const isBalancePayment =
        order.is_preorder &&
        (paymentTypeMeta === "balance" || (order.deposit_paid && !order.balance_paid));

      if (isDepositPayment) {
        // Regla: pre-order (seña) -> deposit_paid: true, mantener estado en 'entrada-en-calor'
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            deposit_paid: true,
            status: "entrada-en-calor",
          })
          .eq("id", order.id);

        if (updateError) {
          console.error(
            `Error al actualizar seña en orden ${order.id}:`,
            updateError.message
          );
          return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        console.log(
          `[Mercado Pago Webhook] ✓ Seña confirmada para pre-order #${order.id.slice(0, 8)} (status: entrada-en-calor)`
        );
      } else if (isBalancePayment) {
        // Regla: saldo final -> balance_paid: true, pasar la orden al estado que corresponda ('final-del-juego')
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            balance_paid: true,
            status: "final-del-juego",
          })
          .eq("id", order.id);

        if (updateError) {
          console.error(
            `Error al actualizar saldo en orden ${order.id}:`,
            updateError.message
          );
          return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        console.log(
          `[Mercado Pago Webhook] ✓ Saldo final confirmado para orden #${order.id.slice(0, 8)} (status: final-del-juego)`
        );
      } else {
        // Producto común en stock: pago total aprobado
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            deposit_paid: true,
            balance_paid: true,
            status: "entrada-en-calor",
          })
          .eq("id", order.id);

        if (updateError) {
          console.error(
            `Error al actualizar pago total en orden ${order.id}:`,
            updateError.message
          );
          return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        console.log(
          `[Mercado Pago Webhook] ✓ Pago total aprobado para orden en stock #${order.id.slice(0, 8)}`
        );
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("[Mercado Pago Webhook] Error no controlado:", err);
    // Respondemos 200 en errores generales para evitar saturación de reintentos
    return NextResponse.json(
      { error: "Error procesando webhook", details: err?.message || String(err) },
      { status: 200 }
    );
  }
}

// Soporte para verificación GET de Mercado Pago en IPN
export async function GET(req: Request) {
  return POST(req);
}

