import { Router, Request, Response } from 'express';

const router = Router();

// معالجة الـ Webhooks القادمة من Stripe حين تنجح عملية الدفع فعلياً
router.post('/stripe', (req: Request, res: Response) => {
  const event = req.body;
  
  console.log('Webhook Received:', event.type);
  
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log('Payment Succeeded for amount:', paymentIntent.amount);
    // هنا تقوم بتحديث حالة جدول Donations في الداتا بيس لتصبح "completed"
  }
  
  res.json({ received: true });
});

export default router;
