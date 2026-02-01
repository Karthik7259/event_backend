import OrderModel from "../models/OrderModel.js";
import productModel from "../models/ProductModel.js";
import userModel from "../models/userModel.js";

// Create new order (user)
const createOrder = async (req, res) => {
  try {
    const { items, eventDate, eventLocation, deliveryAddress, notes } = req.body;
    const userId = req.userId || req.body.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order items are required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const productIds = items.map(i => i.productId);
    const products = await productModel.find({ _id: { $in: productIds } });

    const productMap = new Map();
    products.forEach(p => productMap.set(p._id.toString(), p));

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      const quantity = Number(item.quantity || 1);
      const days = Number(item.days || 1);
      const pricePerDay = Number(product.pricePerDay || product.price || 0);
      const totalPrice = pricePerDay * quantity * days;

      if (product.availableQuantity !== undefined && product.availableQuantity < quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }

      orderItems.push({
        productId: product._id,
        productName: product.name,
        productImage: product.images?.[0] || product.image?.[0] || "",
        pricePerDay,
        quantity,
        days,
        totalPrice,
      });

      totalAmount += totalPrice;
    }

    const order = new OrderModel({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      items: orderItems,
      totalAmount,
      status: "pending",
      paymentStatus: "unpaid",
      eventDate: eventDate ? new Date(eventDate) : undefined,
      eventLocation: eventLocation || "",
      deliveryAddress: deliveryAddress || {},
      notes: notes || "",
    });

    const savedOrder = await order.save();

    // Reduce available quantity
    for (const item of orderItems) {
      await productModel.findByIdAndUpdate(item.productId, {
        $inc: { availableQuantity: -item.quantity }
      });
    }

    res.json({ success: true, message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.log("Error creating order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get orders for logged-in user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log("Error getting user orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get order by ID (user)
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId || req.body.userId;

    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.log("Error getting order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: Get all orders
const getAllOrdersAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const orders = await OrderModel.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log("Error getting all orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: Get order stats
const getOrderStats = async (req, res) => {
  try {
    const orders = await OrderModel.find({});
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalOrders = orders.length;

    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const completedOrders = orders.filter(o => o.status === "completed").length;

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        completedOrders,
      }
    });
  } catch (error) {
    console.log("Error getting order stats:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const order = await OrderModel.findByIdAndUpdate(
      id,
      { status, adminNotes: adminNotes || "" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.log("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const order = await OrderModel.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Payment status updated", order });
  } catch (error) {
    console.log("Error updating payment status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: Delete order
const deleteOrderAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.log("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrdersAdmin,
  getOrderStats,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrderAdmin,
};
