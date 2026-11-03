
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const packages = {
  starter: { amount: 19900, credits: 200 },
  creator: { amount: 49900, credits: 600 },
  studio: { amount: 99900, credits: 1500 },
} as const;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Razorpay is not configured." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const packageId = String(body.packageId || "");
    if (!(packageId in packages)) {
      return NextResponse.json({ error: "Invalid credit package." }, { status: 400 });
    }

    const selected = packages[packageId as keyof typeof packages];
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: selected.amount,
      currency: "INR",
      receipt: `cf_${randomUUID().replace(/-/g, "").slice(0, 24)}`,
      notes: { userId: session.id, packageId },
    });

    await prisma.paymentOrder.create({
      data: {
        userId: session.id,
        orderId: order.id,
        packageId,
        amount: selected.amount,
        credits: selected.credits,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: selected.amount,
      currency: "INR",
      keyId,
      credits: selected.credits,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    return NextResponse.json({ error: "Unable to create payment order." }, { status: 502 });
  }
}
