import { Request, Response } from 'express';
import { paymentService } from '../services/paymentService';

export async function createPaymentIntent(req: Request, res: Response) {
  try {
    const { orderId, amount, currency = 'USD', provider = 'Stripe' } = req.body;

    if (!orderId || amount === undefined) {
      return res.status(400).json({ error: 'orderId and amount are required.' });
    }

    const intent = await paymentService.createPaymentIntent(orderId, Number(amount), currency, provider);
    return res.status(201).json({
      message: 'Payment intent created successfully',
      intent
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function confirmPayment(req: Request, res: Response) {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ error: 'transactionId is required.' });
    }

    const payment = await paymentService.confirmPayment(transactionId);
    return res.json({
      message: 'Payment captured and confirmed successfully',
      payment
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function refundPayment(req: Request, res: Response) {
  try {
    const { orderId, reason = 'Order cancelled' } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required.' });
    }

    const refund = await paymentService.processRefund(orderId, reason);
    if (!refund) {
      return res.status(404).json({ error: `No payment found for order #${orderId}` });
    }

    return res.json({
      message: `Refund processed successfully for order #${orderId}`,
      refund
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
