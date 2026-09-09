import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { preferenceClient } from "@/lib/mercadopago";

export const dynamic = "force-dynamic";

export interface CheckoutRequestBody {
  orderId: string;
  paymentType?: "deposit" | "balance" | "full";
}

export async function POST(req: Request) {
  try {
    const body: CheckoutRequestBody = await req.json();
    const { orderId } = body;

    // 1. Validar parámetros requeridos
    if (!orderId || !orderId.trim()) {
      return NextResponse.json(
        { error: "El orderId es requerido para generar el checkout." },
        { status: 400 }
      );
    }

    // 2. Buscar la orden en Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId.trim())
      .single();

    if (orderError || !order) {
      console.error("Orden no encontrada en Supabase:", orderError);
      return NextResponse.json(
        { error: "No se encontró la orden especificada en la base de datos." },
        { status: 404 }
      );
    }

    // 3. Determinar tipo de pago y monto a cobrar:
    // - Si is_preorder (Por Encargo):
    //   - Si la seña no está paga (o no se especificó balance): 50% del total.
    //   - Si la seña ya está paga y falta el saldo: 50% restante (balance).
    // - Si es producto en stock común (!is_preorder): 100% del total.
    let paymentType: "deposit" | "balance" | "full" = "full";
    let unitPrice = Number(order.total_amount);
    let itemTitle = `Pago Total - Pedido #${order.id.slice(0, 8)} (L'essentiel)`;

    if (order.is_preorder) {
      const halfAmount = Math.round(Number(order.total_amount) * 0.5 * 100) / 100;

      if (body.paymentType === "balance" || (order.deposit_paid && !order.balance_paid)) {
        paymentType = "balance";
        unitPrice = halfAmount;
        itemTitle = `Saldo Final (50%) - Pedido #${order.id.slice(0, 8)} (L'essentiel)`;
      } else {
        paymentType = "deposit";
        unitPrice = halfAmount;
        itemTitle = `Seña (50%) - Pedido #${order.id.slice(0, 8)} (L'essentiel)`;
      }
    }

    // 4. Configurar URL base (Vercel / dominio personalizado)
    const rawAppUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const appUrl = rawAppUrl.replace(/\/$/, "");

    // 5. Configurar preferencia de pago de Mercado Pago
    const preferencePayload = {
      items: [
        {
          id: order.id,
          title: itemTitle,
          description: order.is_preorder
            ? paymentType === "deposit"
              ? "Seña inicial del 50% para reserva y producción de botines por encargo"
              : "Saldo final del 50% para despacho y entrega de botines"
            : "Compra de botines en stock con entrega inmediata",
          quantity: 1,
          currency_id: "ARS",
          unit_price: unitPrice,
        },
      ],
      payer: {
        name: order.customer_name,
        email: order.customer_email,
      },
      back_urls: {
        success: `${appUrl}/checkout/success?orderId=${order.id}&paymentType=${paymentType}`,
        failure: `${appUrl}/checkout/failure?orderId=${order.id}&paymentType=${paymentType}`,
        pending: `${appUrl}/checkout/pending?orderId=${order.id}&paymentType=${paymentType}`,
      },
      auto_return: "approved",
      external_reference: order.id,
      notification_url: `${appUrl}/api/webhooks/mercadopago`,
      statement_descriptor: "LESSENTIEL",
      metadata: {
        order_id: order.id,
        payment_type: paymentType,
        is_preorder: order.is_preorder,
        customer_email: order.customer_email,
      },
    };

    // Crear la preferencia en Mercado Pago
    const preference = await preferenceClient.create({
      body: preferencePayload,
    });

    if (!preference || !preference.id) {
      throw new Error("No se pudo obtener el ID de preferencia desde Mercado Pago.");
    }

    // 6. Almacenar el ID de preferencia en la orden dentro de Supabase
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        preference_id: preference.id,
      })
      .eq("id", order.id);

    if (updateError) {
      console.warn(
        "Aviso: No se pudo almacenar el preference_id en Supabase:",
        updateError.message
      );
    }

    // 7. Devolver información para redirigir al usuario al Checkout Pro
    return NextResponse.json({
      success: true,
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      paymentType,
      amountToPay: unitPrice,
      order: {
        id: order.id,
        customer_name: order.customer_name,
        total_amount: order.total_amount,
        is_preorder: order.is_preorder,
      },
    });
  } catch (error: any) {
    console.error("Error en /api/checkout:", error);
    return NextResponse.json(
      {
        error: "Error al generar la preferencia de pago de Mercado Pago.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

