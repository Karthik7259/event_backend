import express from 'express';

import {placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrders,updateStatus, verifyRazor} from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authuser from '../middleware/auth.js';

const OrderRouter=express.Router();

// Admin Features
OrderRouter.post('/list',adminAuth,allOrders);
OrderRouter.put('/status',adminAuth,updateStatus);


// payment Features
OrderRouter.post('/place',authuser,placeOrder);
OrderRouter.post('/stripe',authuser,placeOrderStripe);
OrderRouter.post('/razorpay',authuser,placeOrderRazorpay);

// User Features
OrderRouter.post('/userorders',authuser,userOrders);

// verify Razorpay payment
OrderRouter.post('/verifyRazorpay',authuser,verifyRazor);


export default OrderRouter;