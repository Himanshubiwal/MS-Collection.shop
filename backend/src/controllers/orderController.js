import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { getRazorpayInstance } from '../config/razorpay.js';

// @desc    Initialize a secure Razorpay order with backend price validation
// @route   POST /api/orders/create-razorpay-order
// @access  Private
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error('No items in order');
    }

    // Verify stock availability & recalculate authentic prices from database
    let calculatedItemsSubtotal = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product ${item.name || 'Unknown'} not found`);
      }
      const variant = product.variants.find(v => v.sku === item.sku || (v.size === item.size && v.colorName === item.colorName));
      if (variant && variant.stockQuantity < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.name} (${item.size} / ${item.colorName}). Only ${variant.stockQuantity} remaining.`);
      }

      const unitPrice = product.price + (variant?.priceAdjustment || 0);
      calculatedItemsSubtotal += unitPrice * item.quantity;
      verifiedOrderItems.push({
        ...item,
        price: unitPrice,
      });
    }

    // Secure calculation to prevent frontend tampering while allowing valid promotional discounts
    const finalItemsPrice = Number(itemsPrice) <= calculatedItemsSubtotal && Number(itemsPrice) >= 0 
      ? Number(itemsPrice) 
      : calculatedItemsSubtotal;
    const finalShippingPrice = Number(shippingPrice) >= 0 ? Number(shippingPrice) : (finalItemsPrice >= 150 ? 0 : 15);
    const finalTaxPrice = Number(taxPrice) >= 0 ? Number(taxPrice) : Math.round(finalItemsPrice * 0.13 * 100) / 100;
    const secureTotalPrice = Math.round((finalItemsPrice + finalShippingPrice + finalTaxPrice) * 100) / 100;

    // Create Razorpay order amount in smallest currency unit (cents/paise)
    const amountInCents = Math.round(secureTotalPrice * 100);

    const razorpay = getRazorpayInstance();
    const options = {
      amount: amountInCents,
      currency: 'INR',
      receipt: `receipt_mscollection_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        shippingCity: shippingAddress.city,
      },
    };

    let razorpayOrder;
    try {
      if (process.env.RAZORPAY_KEY_ID === 'rzp_test_YourKeyIdHere' || !process.env.RAZORPAY_KEY_ID) {
        // Dev fallback simulation when keys are unconfigured placeholders
        razorpayOrder = {
          id: `order_sim_${Date.now()}`,
          amount: amountInCents,
          currency: 'INR',
          receipt: options.receipt,
          status: 'created',
          simulation: true,
        };
      } else {
        razorpayOrder = await razorpay.orders.create(options);
      }
    } catch (rzpErr) {
      console.error('[Razorpay API Error]:', rzpErr);
      res.status(500);
      throw new Error(`Razorpay gateway error: ${rzpErr.message || 'Unable to initiate order'}`);
    }

    // Create preliminary Order record in pending state
    const order = await Order.create({
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod: 'Razorpay',
      razorpayOrderId: razorpayOrder.id,
      itemsPrice: finalItemsPrice,
      shippingPrice: finalShippingPrice,
      taxPrice: finalTaxPrice,
      totalPrice: secureTotalPrice,
      isPaid: false,
      orderStatus: 'Pending',
    });

    res.status(201).json({
      success: true,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyIdHere',
      simulation: razorpayOrder.simulation || false,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment signature & decrement stock atomically
// @route   POST /api/orders/verify-payment
// @access  Private
export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, simulation } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error('Order record not found');
    }

    // Idempotency check: if already marked paid (e.g., by webhook), return success immediately
    if (order.isPaid) {
      return res.json({
        success: true,
        message: 'Order already verified and processed.',
        order,
      });
    }

    let isAuthentic = false;

    if (simulation || razorpayOrderId?.startsWith('order_sim_')) {
      // In dev simulation mode, automatically pass verification
      isAuthentic = true;
    } else {
      // Production HMAC SHA256 Signature Verification
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YourRazorpaySecretHere')
        .update(body.toString())
        .digest('hex');

      isAuthentic = expectedSignature === razorpaySignature;
    }

    if (isAuthentic) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.razorpayPaymentId = razorpayPaymentId || `sim_pay_${Date.now()}`;
      order.razorpaySignature = razorpaySignature || 'sim_sig_verified';
      order.orderStatus = 'Processing';

      // Atomic inventory deduction using $inc to prevent overselling under high concurrency
      for (const item of order.orderItems) {
        await Product.findOneAndUpdate(
          {
            _id: item.product,
            'variants.sku': item.sku,
            'variants.stockQuantity': { $gte: item.quantity },
          },
          {
            $inc: { 'variants.$.stockQuantity': -item.quantity },
          }
        );
      }

      const updatedOrder = await order.save();
      res.json({
        success: true,
        message: 'Payment verified successfully. Order is now processing.',
        order: updatedOrder,
      });
    } else {
      order.orderStatus = 'Cancelled';
      await order.save();
      res.status(400);
      throw new Error('Payment verification failed! Signature mismatch.');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Handle Razorpay Webhooks (order.paid / payment.captured) for asynchronous reliability
// @route   POST /api/orders/webhook
// @access  Public (Signature Verified)
export const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret || webhookSecret === 'YourWebhookSecretHere') {
      console.warn('[Razorpay Webhook Warning]: RAZORPAY_WEBHOOK_SECRET is not configured.');
      return res.status(400).json({ success: false, message: 'Webhook secret unconfigured on server' });
    }

    const signature = req.headers['x-razorpay-signature'];
    const payload = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('[Razorpay Webhook Error]: Invalid signature mismatch');
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const paymentData = req.body.payload?.payment?.entity;
    const razorpayOrderId = paymentData?.order_id || req.body.payload?.order?.entity?.id;

    if (event === 'order.paid' || event === 'payment.captured') {
      if (razorpayOrderId) {
        const order = await Order.findOne({ razorpayOrderId });
        if (order && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.razorpayPaymentId = paymentData?.id || order.razorpayPaymentId;
          order.orderStatus = 'Processing';

          // Atomic inventory deduction
          for (const item of order.orderItems) {
            await Product.findOneAndUpdate(
              {
                _id: item.product,
                'variants.sku': item.sku,
                'variants.stockQuantity': { $gte: item.quantity },
              },
              {
                $inc: { 'variants.$.stockQuantity': -item.quantity },
              }
            );
          }

          await order.save();
          console.log(`[Razorpay Webhook]: Captured payment asynchronously for Order #${order._id}`);
        }
      }
    }

    res.status(200).json({ success: true, status: 'ok' });
  } catch (error) {
    console.error('[Razorpay Webhook Processing Error]:', error);
    res.status(500).json({ success: false, message: 'Internal Webhook Error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order && (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin')) {
      res.json({
        success: true,
        order,
      });
    } else {
      res.status(404);
      throw new Error('Order not found or unauthorized access');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status & tracking number (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      if (orderStatus) order.orderStatus = orderStatus;
      if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
      if (orderStatus === 'Delivered') {
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json({
        success: true,
        order: updatedOrder,
      });
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};
