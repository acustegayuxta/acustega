import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS: Record<string, string | undefined> = {
  report: process.env.NEXT_PUBLIC_STRIPE_PRICE_REPORT_ID,
  bundle: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUNDLE_ID,
  prompt: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROMPT_ID,
};

export async function POST(req: NextRequest) {
  try {
    const { product } = await req.json() as { product: string };

    const priceId = PRICE_IDS[product];
    if (!priceId) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    const origin = req.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/reporte?success=true&product=${product}`,
      cancel_url: `${origin}/reporte?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe-checkout] Error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
