import express from 'express';
import authuser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrdersAdmin,
  getOrderStats,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrderAdmin,
} from '../controllers/orderController.js';

const orderRouter = express.Router();

// User routes
orderRouter.post('/create', authuser, createOrder);
orderRouter.get('/user', authuser, getUserOrders);

// Admin routes
orderRouter.get('/admin/all', adminAuth, getAllOrdersAdmin);
orderRouter.get('/admin/stats', adminAuth, getOrderStats);
orderRouter.put('/admin/status/:id', adminAuth, updateOrderStatus);
orderRouter.put('/admin/payment/:id', adminAuth, updatePaymentStatus);
orderRouter.delete('/admin/:id', adminAuth, deleteOrderAdmin);

// User route (must be last)
orderRouter.get('/:id', authuser, getOrderById);

export default orderRouter;
