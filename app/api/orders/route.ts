import { NextResponse } from "next/server";
import { supabase, type OrderStatus } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export interface CartItemInput {
  id?: string;
  name: string;
  price: number;
  quantity?: number;
  size?: number | string;
  is_by_request?: boolean;
}

export interface CreateOrderRequest {
  customer_name: string;
  customer_email: string;
  phone: string;
  preferred_size: number;
  items: CartItemInput[];
  total_amount?: number;
  payment_method?: "mercadopago" | "transferencia";
}

export async function POST(req: Request) {
  try {
    const body: CreateOrderRequest = await req.json();
    const { customer_name, customer_email, phone, preferred_size, items, payment_method } = body;

    // 1. Validaciones básicas de entrada
    if (!customer_name || !customer_name.trim()) {
      return NextResponse.json(
        { error: "El nombre del cliente (customer_name) es requerido." },
        { status: 400 }
      );
    }

    if (!customer_email || !customer_email.trim() || !customer_email.includes("@")) {
      return NextResponse.json(
        { error: "El email del cliente (customer_email) es inválido o requerido." },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: "El teléfono / WhatsApp es requerido." }, { status: 400 });
    }

    if (!preferred_size || preferred_size < 35 || preferred_size > 50) {
      return NextResponse.json({ error: "El talle ARG es requerido y debe ser válido." }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "El carrito debe contener al menos un producto (items)." },
        { status: 400 }
      );
    }

    // 2. Determinar si la orden incluye productos por encargo (is_by_request)
    const isPreorder = items.some((item) => Boolean(item.is_by_request));

    // 3. Calcular monto total de la orden
    const calculatedTotal = items.reduce((sum, item) => {
      const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
      return sum + Number(item.price || 0) * qty;
    }, 0);

    const totalAmount =
      body.total_amount && body.total_amount > 0
        ? body.total_amount
        : calculatedTotal;

    // 4. Lógica de flujo de cobro:
    // - Si es por encargo (is_by_request): Seña inicial del 50%, saldo restante del 50%.
    // - Si es producto en stock: Cobro del total (100%).
    const depositAmount = isPreorder ? Math.round(totalAmount * 0.5 * 100) / 100 : 0;
    const balanceAmount = isPreorder ? Math.round((totalAmount - depositAmount) * 100) / 100 : 0;
    const amountToPayNow = isPreorder ? depositAmount : totalAmount;

    // 5. Crear la orden en Supabase
    // - status: 'entrada-en-calor'
    // - is_preorder: true si es por encargo, false si es en stock
    // - deposit_paid: false (se confirma al recibir la aprobación de pago)
    // - balance_paid: false
    const orderData = {
      customer_name: customer_name.trim(),
      customer_email: customer_email.trim().toLowerCase(),
      phone: phone.trim(),
      preferred_size: Number(preferred_size),
      total_amount: totalAmount,
      status: "entrada-en-calor" as const,
      is_preorder: isPreorder,
      deposit_paid: false,
      balance_paid: false,
      items: items,
    };

    type CheckoutOrder = Omit<typeof orderData, "status"> & {
      status: OrderStatus;
      id: string;
      created_at: string;
    };
    let order: CheckoutOrder;
    let isFallback = false;

    try {
      const { data, error: insertError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (insertError || !data) {
        throw insertError || new Error("Supabase no devolvió la orden creada.");
      }

      order = data as CheckoutOrder;
    } catch (error) {
      isFallback = true;
      console.warn("Supabase no disponible. Continuando con orden local:", error);
      order = {
        ...orderData,
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        created_at: new Date().toISOString(),
      };
    }

    // 6. Preparar estructura lista para pasarela de pago (Mercado Pago / Checkout)
    const gatewayPayload = {
      order_id: order.id,
      title: isPreorder
        ? `Seña 50% - Pedido #${order.id.slice(0, 8)} (L'essentiel)`
        : `Pago Total - Pedido #${order.id.slice(0, 8)} (L'essentiel)`,
      currency_id: "ARS",
      amount_to_pay: amountToPayNow,
      payment_type: isPreorder ? "deposit" : "full",
      payer: {
        name: order.customer_name,
        email: order.customer_email,
      },
      items: items.map((item) => ({
        id: item.id || "producto",
        title: item.name,
        unit_price: isPreorder
          ? Math.round(Number(item.price || 0) * 0.5 * 100) / 100
          : Number(item.price || 0),
        quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
        size: item.size,
        is_by_request: Boolean(item.is_by_request),
      })),
      metadata: {
        order_id: order.id,
        is_preorder: isPreorder,
        total_order_amount: totalAmount,
        deposit_amount: depositAmount,
        balance_amount: balanceAmount,
        payment_method: payment_method || "mercadopago",
      },
    };

    // 7. Respuesta estructurada
    return NextResponse.json(
      {
        success: true,
        order,
        is_fallback: isFallback,
        payment: {
          flow: isPreorder ? "preorder_deposit" : "stock_full_payment",
          amount_to_pay: amountToPayNow,
          total_order_amount: totalAmount,
          deposit_amount: depositAmount,
          balance_remaining: balanceAmount,
          status: "pending_payment",
          gateway_payload: gatewayPayload,
        },
      },
      { status: isFallback ? 200 : 201 }
    );
  } catch (err: any) {
    console.error("Error en POST /api/orders:", err);
    return NextResponse.json(
      {
        error: "Error inesperado al procesar la orden.",
        message: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
