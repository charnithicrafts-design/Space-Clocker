import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    res.status(500).json({ error: 'Razorpay KEY_SECRET not configured on the server' });
    return;
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({ error: 'Missing required signature verification fields' });
    return;
  }

  try {
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.status(200).json({ success: true, message: 'Payment signature verified successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Signature mismatch. Verification failed.' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Signature verification failed' });
  }
}
