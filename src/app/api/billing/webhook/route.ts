
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { fulfillPayment } from "@/lib/billing";

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });

  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";

  const expected = createHmac("sha256", secret).update(raw).digest();
  const supplied = Buffer.from(signature, "hex");

  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  try {
    const event = JSON.parse(raw);
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload?.payment?.entity;
      const orderId =
        payment?.order_id ||
        event.payload?.order?.entity?.id;
      const paymentId = payment?.id;

      if (orderId && paymentId) {
        await fulfillPayment(String(orderId), String(paymentId));
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook processing failed:", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
