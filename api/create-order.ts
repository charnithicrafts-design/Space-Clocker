import Razorpay from 'razorpay';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    res.status(401).json({ error: 'Razorpay API credentials not configured on the server' });
    return;
  }

  const { amount, currency, receipt } = req.body || {};

  if (!amount || typeof amount !== 'number' || amount < 100) {
    res.status(400).json({ error: 'Amount must be at least 100 paise (1 INR)' });
    return;
  }

  try {
    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount,
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
}
