import { NextRequest } from "next/server";

const WOMPI_API = "https://production.wompi.co/v1/payment_links";

interface RequestBody {
  client: {
    nombre: string;
    empresa: string;
    email: string;
    telefono: string;
    ciudad: string;
    espacio: string;
    tasa: string;
    notas: string;
  };
  items: Array<{
    id: string;
    nombre: string;
    qty: number;
    precioUsd: number;
  }>;
  totalUsd: number;
}

export async function POST(req: NextRequest) {
  const privateKey = process.env.WOMPI_PRIVATE_KEY;
  const tasa       = parseFloat(process.env.WOMPI_TASA_COP ?? "4200");

  if (!privateKey) {
    return Response.json({ error: "WOMPI_PRIVATE_KEY is not configured" }, { status: 500 });
  }

  const body = (await req.json()) as RequestBody;
  const { client, items, totalUsd } = body;

  if (!totalUsd || totalUsd <= 0) {
    return Response.json({ error: "totalUsd must be greater than 0" }, { status: 400 });
  }

  // Wompi amounts are in cents (COP)
  const amountCents = Math.round(totalUsd * tasa * 100);

  // Build description from items list (max 255 chars)
  const itemDesc = items
    .map((i) => `${i.nombre} ×${i.qty}`)
    .join(", ")
    .slice(0, 220);

  const description = `Cotización Acustega${client.espacio ? ` – ${client.espacio}` : ""}${itemDesc ? `: ${itemDesc}` : ""}`.slice(0, 255);

  const payload = {
    name: `Cotización Acustega AI${client.nombre ? ` – ${client.nombre}` : ""}`.slice(0, 100),
    description,
    single_use: true,
    collect_shipping: false,
    currency: "COP",
    amount_in_cents: amountCents,
    ...(client.email
      ? {
          customer_data: {
            customer_email: client.email,
            full_name: client.nombre || undefined,
            phone_number: client.telefono || undefined,
          },
        }
      : {}),
  };

  try {
    const res = await fetch(WOMPI_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${privateKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as {
      data?: { id: string; payment_link?: string; permalink?: string };
      error?: { type: string; messages?: Record<string, string[]> };
    };

    if (!res.ok || !data.data) {
      const msg = data.error?.messages
        ? Object.values(data.error.messages).flat().join(", ")
        : (data.error?.type ?? `HTTP ${res.status}`);
      console.error("[Wompi] Error:", msg);
      return Response.json({ error: msg }, { status: res.status });
    }

    const url = data.data.permalink ?? data.data.payment_link ?? `https://checkout.wompi.co/l/${data.data.id}`;

    console.log("[Wompi] Link created:", url);
    return Response.json({ url });
  } catch (err) {
    console.error("[Wompi] Unexpected error:", err);
    return Response.json({ error: "Error connecting to Wompi" }, { status: 500 });
  }
}
