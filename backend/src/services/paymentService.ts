import { Payment } from '../db/models';
import { db } from '../db/database';

export interface PaymentIntentResult {
  clientSecret: string;
  transactionId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Completed' | 'RequiresAction';
}

export class PaymentService {
  /**
   * Create a simulated Stripe / CyberPay payment intent for an order
   */
  public async createPaymentIntent(
    orderId: string,
    amount: number,
    currency: string = 'USD',
    provider: 'Stripe' | 'CyberPay' | 'Card' | 'Mock' = 'Stripe'
  ): Promise<PaymentIntentResult> {
    const order = await db.findOrderById(orderId);
    if (!order) {
      throw new Error(`Order #${orderId} does not exist for payment intent.`);
    }

    const clientSecret = `pi_${orderId.toLowerCase().replace('-', '_')}_secret_${Math.random().toString(36).substring(2, 15)}`;
    const transactionId = `TXN-${provider.toUpperCase()}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await db.createPayment({
      orderId,
      amount,
      currency,
      provider,
      status: 'Pending',
      paymentDetails: { clientSecret, createdAt: new Date().toISOString() }
    });

    return {
      clientSecret,
      transactionId: payment.transactionId,
      orderId,
      amount,
      currency,
      status: 'Pending'
    };
  }

  /**
   * Confirm and capture payment for an order
   */
  public async confirmPayment(transactionId: string): Promise<Payment> {
    // Look up payment
    const payment = await db.findPaymentByOrderId(transactionId);
    // In our system, transactionId or orderId can confirm payment
    if (!payment) {
      throw new Error(`Payment transaction "${transactionId}" not found.`);
    }

    payment.status = 'Completed';
    payment.updatedAt = new Date().toISOString();

    const order = await db.findOrderById(payment.orderId);
    if (order) {
      order.paymentStatus = 'Paid';
      order.updatedAt = new Date().toISOString();
    }

    return payment;
  }

  /**
   * Issue automated refund on order cancellation
   */
  public async processRefund(orderId: string, reason: string): Promise<Payment | null> {
    const payment = await db.findPaymentByOrderId(orderId);
    if (!payment) {
      return null;
    }

    payment.status = 'Refunded';
    payment.paymentDetails = {
      ...payment.paymentDetails,
      refundReason: reason,
      refundedAt: new Date().toISOString()
    };
    payment.updatedAt = new Date().toISOString();

    return payment;
  }
}

export const paymentService = new PaymentService();
