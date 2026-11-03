
import { prisma } from "@/lib/prisma";

export async function fulfillPayment(orderId: string, paymentId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.paymentOrder.findUnique({
      where: { orderId },
    });

    if (!order) throw new Error("PAYMENT_ORDER_NOT_FOUND");
    if (order.status === "PAID") return { alreadyPaid: true };

    const changed = await tx.paymentOrder.updateMany({
      where: { id: order.id, status: "PENDING" },
      data: { status: "PAID", paymentId },
    });

    if (changed.count !== 1) {
      const latest = await tx.paymentOrder.findUnique({
        where: { id: order.id },
      });
      if (latest?.status === "PAID") return { alreadyPaid: true };
      throw new Error("PAYMENT_NOT_PENDING");
    }

    await tx.user.update({
      where: { id: order.userId },
      data: { credits: { increment: order.credits } },
    });

    await tx.creditTransaction.create({
      data: {
        userId: order.userId,
        amount: order.credits,
        type: "PURCHASE",
        description: `Razorpay credit package: ${order.packageId}`,
        referenceId: order.orderId,
      },
    });

    return { alreadyPaid: false, credits: order.credits };
  });
}
