
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import Razorpay from "razorpay";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fulfillPayment } from "@/lib/billing";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return NextResponse.json({ error: "Payment configuration missing." }, { status: 503 });

  try {
    const body = await request.json();
    const orderId = String(body.razorpay_order_id || "");
    const paymentId = String(body.razorpay_payment_id || "");
    const signature = String(body.razorpay_signature || "");

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Payment details are incomplete." }, { status: 400 });
    }

    const order = await prisma.paymentOrder.findFirst({
      where: { orderId, userId: session.id },
    });
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    const expected = createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest();

    let supplied: Buffer;
    try {
      supplied = Buffer.from(signature, "hex");
    } catch {
      return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
    }

    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      return NextResponse.json({ error: "Payment signature verification failed." }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: secret,
    });
    const payment = await razorpay.payments.fetch(paymentId);

    if (
      String(payment.order_id) !== orderId ||
      Number(payment.amount) !== order.amount ||
      String(payment.currency) !== "INR" ||
      String(payment.status) !== "captured"
    ) {
      return NextResponse.json({ error: "Payment is not captured or does not match this order." }, { status: 409 });
    }

    const result = await fulfillPayment(orderId, paymentId);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Payment verification failed." }, { status: 502 });
  }
}
