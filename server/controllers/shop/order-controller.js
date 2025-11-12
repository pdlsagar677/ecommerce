const crypto = require("crypto");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    // Create the order first
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    });

    await newlyCreatedOrder.save();

    // Handle eSewa payment
    if (paymentMethod === "esewa") {
      // eSewa payment parameters
      const transaction_uuid = `ESEWA_${newlyCreatedOrder._id}_${Date.now()}`;
      const total_amount = totalAmount.toFixed(2);
      const product_code = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
      
      // Get URLs from environment variables
     
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const successUrl = `${frontendUrl}/shop/esewa-success`;
      const failureUrl = `${frontendUrl}/shop/esewa-failure?orderId=${newlyCreatedOrder._id}`;
      
      console.log("eSewa Payment URLs:", { successUrl, failureUrl });

      
      // Signature generation
      const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
      
      const signature = crypto.createHmac('sha256', process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q')
        .update(message)
        .digest('base64');

      // Payment data
      const paymentData = {
        amount: total_amount,
        tax_amount: "0",
        total_amount: total_amount,
        transaction_uuid: transaction_uuid,
        product_code: product_code,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: successUrl,
        failure_url: failureUrl,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: signature,
        merchant_id: process.env.ESEWA_MERCHANT_ID || "EPAYTEST"
      };

      console.log("eSewa Payment Data:", paymentData);

      // Save transaction ID to order
      newlyCreatedOrder.esewaTransactionId = transaction_uuid;
      await newlyCreatedOrder.save();

      // eSewa payment URL
      const esewaPaymentUrl = process.env.ESEWA_BASE_URL ? 
        `${process.env.ESEWA_BASE_URL}/api/epay/main/v2/form` : 
        "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      res.status(201).json({
        success: true,
        paymentUrl: esewaPaymentUrl,
        paymentData: paymentData,
        orderId: newlyCreatedOrder._id,
        transactionId: transaction_uuid,
      });
    } else {
      // For other payment methods (like cash on delivery)
      res.status(201).json({
        success: true,
        orderId: newlyCreatedOrder._id,
        message: "Order created successfully"
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};
const capturePayment = async (req, res) => {
  try {
    const { orderId, transactionId, paymentMethod } = req.body;

    console.log("🔄 Capturing payment for order:", { orderId, transactionId, paymentMethod });

    let order = await Order.findById(orderId);

    if (!order) {
      console.log("❌ Order not found:", orderId);
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    console.log("📦 Order found:", order._id);

    // Handle eSewa capture
    if (paymentMethod === "esewa") {
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.esewaPaymentId = transactionId;
      order.paymentDate = new Date();
      order.orderUpdateDate = new Date();
    } else {
      // For other payment methods
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentDate = new Date();
      order.orderUpdateDate = new Date();
    }

    console.log("📋 Updating product stock...");
    // Update product stock
    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        console.log("❌ Product not found:", item.productId);
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.title}`,
        });
      }

      if (product.totalStock < item.quantity) {
        console.log("❌ Not enough stock:", product.title, product.totalStock, item.quantity);
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.title}`,
        });
      }

      console.log("📦 Updating stock for:", product.title, "from", product.totalStock, "to", product.totalStock - item.quantity);
      product.totalStock -= item.quantity;
      await product.save();
    }

    // Clear cart
    if (order.cartId) {
      console.log("🗑️ Clearing cart:", order.cartId);
      await Cart.findByIdAndDelete(order.cartId);
    }

    await order.save();
    console.log("✅ Order updated successfully:", order._id);

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log("❌ Capture payment error:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
      error: e.message
    });
  }
};
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// eSewa payment success callback
// eSewa payment success callback
const esewaSuccessCallback = async (req, res) => {
  try {
    console.log("eSewa Callback Received:", req.body);
    
    const {
      transaction_uuid,
      transaction_code,
      status,
      total_amount,
      signature
    } = req.body;

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    // Verify signature
    const message = `transaction_code=${transaction_code},status=${status},total_amount=${total_amount},transaction_uuid=${transaction_uuid}`;
    const expectedSignature = crypto.createHmac('sha256', process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q')
      .update(message)
      .digest('base64');

    console.log("Signature Verification:", {
      received: signature,
      expected: expectedSignature
    });

    if (signature !== expectedSignature) {
      console.log("Invalid signature");
      return res.status(400).send('Invalid signature');
    }

    if (status === 'COMPLETE') {
      const order = await Order.findOne({ 
        esewaTransactionId: transaction_uuid 
      });

      if (order) {
        order.paymentStatus = "paid";
        order.paymentMethod = "esewa";
        order.esewaPaymentId = transaction_code;
        order.paymentDate = new Date();
        order.orderStatus = "confirmed";
        
        // Update product stock
        for (let item of order.cartItems) {
          let product = await Product.findById(item.productId);
          if (product) {
            product.totalStock -= item.quantity;
            await product.save();
          }
        }
        
        // Clear cart
        if (order.cartId) {
          await Cart.findByIdAndDelete(order.cartId);
        }
        
        await order.save();
        console.log("Order payment updated via callback:", order._id);
      }

      // Redirect to success page with proper parameters
      const successUrl = `${frontendUrl}/shop/esewa-success?transactionId=${transaction_code}&orderId=${order._id}`;
      console.log("Redirecting to success page:", successUrl);
      res.redirect(successUrl);
    } else {
      const failureUrl = `${frontendUrl}/shop/payment-failed`;
      console.log("Redirecting to failure page:", failureUrl);
      res.redirect(failureUrl);
    }
  } catch (error) {
    console.error("eSewa callback error:", error);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/shop/payment-failed`);
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  esewaSuccessCallback,
};