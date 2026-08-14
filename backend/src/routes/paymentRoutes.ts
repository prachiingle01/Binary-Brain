import { Router } from 'express';
import { createPaymentIntent, confirmPayment, refundPayment } from '../controllers/paymentController';

const router = Router();

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.post('/refund', refundPayment);

export default router;
