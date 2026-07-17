import { describe, it, expect, vi, beforeEach } from 'vitest';
import createOrderHandler from '../../api/create-order';
import verifyPaymentHandler from '../../api/verify-payment';
import crypto from 'crypto';

// Mock Razorpay SDK
vi.mock('razorpay', () => {
  return {
    default: vi.fn().mockImplementation(function () {
      return {
        orders: {
          create: vi.fn().mockImplementation((options) => {
            if (options.amount === 999999) {
              return Promise.reject(new Error('Razorpay API Error'));
            }
            return Promise.resolve({
              id: 'order_mocked_456',
              amount: options.amount,
              currency: options.currency
            });
          })
        }
      };
    })
  };
});

describe('Razorpay Serverless APIs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RAZORPAY_KEY_ID = 'rzp_test_TETxMjivOA8qJY';
    process.env.RAZORPAY_KEY_SECRET = 'vSqsT82XmmrYidO2gHpoRnK1';
  });

  describe('POST /api/create-order', () => {
    it('should successfully create a Razorpay order', async () => {
      const req = {
        method: 'POST',
        body: {
          amount: 5000,
          currency: 'INR',
          receipt: 'receipt_test_1'
        }
      };

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        send: vi.fn()
      };

      await createOrderHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        order_id: 'order_mocked_456',
        amount: 5000,
        currency: 'INR'
      });
    });

    it('should reject requests with amount less than 100 paise', async () => {
      const req = {
        method: 'POST',
        body: {
          amount: 50,
          currency: 'INR'
        }
      };

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        send: vi.fn()
      };

      await createOrderHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('at least 100 paise')
      }));
    });

    it('should reject non-POST requests', async () => {
      const req = { method: 'GET' };
      const res = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn()
      };

      await createOrderHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.send).toHaveBeenCalledWith('Method Not Allowed');
    });

    it('should handle Razorpay API errors gracefully', async () => {
      const req = {
        method: 'POST',
        body: {
          amount: 999999,
          currency: 'INR'
        }
      };

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await createOrderHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Razorpay API Error' });
    });
  });

  describe('POST /api/verify-payment', () => {
    it('should successfully verify a valid Razorpay signature', async () => {
      const orderId = 'order_test_123';
      const paymentId = 'pay_test_123';
      const secret = 'vSqsT82XmmrYidO2gHpoRnK1';

      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(orderId + '|' + paymentId)
        .digest('hex');

      const req = {
        method: 'POST',
        body: {
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: expectedSignature
        }
      };

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await verifyPaymentHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Payment signature verified successfully'
      });
    });

    it('should reject signature mismatches with 400', async () => {
      const req = {
        method: 'POST',
        body: {
          razorpay_order_id: 'order_test_123',
          razorpay_payment_id: 'pay_test_123',
          razorpay_signature: 'invalid_signature_here'
        }
      };

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await verifyPaymentHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Signature mismatch. Verification failed.'
      });
    });

    it('should return 400 if required parameters are missing', async () => {
      const req = {
        method: 'POST',
        body: {
          razorpay_order_id: 'order_test_123'
        }
      };

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await verifyPaymentHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required signature verification fields'
      });
    });
  });
});
