import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import orderModel from './models/orderModel.js';
import userModel from './models/userModel.js';
import productModel from './models/productModel.js';

const seedOrders = async () => {
    try {
        await connectDB();
        console.log('Connected to database');

        // Get or create a test user
        let testUser = await userModel.findOne({ email: 'test@example.com' });
        if (!testUser) {
            testUser = await userModel.create({
                name: 'Test Customer',
                email: 'test@example.com',
                password: 'hashedpassword123', // In real scenario, this would be hashed
                phone: '+91 9876543210',
            });
            console.log('Created test user');
        }

        // Get some products
        const products = await productModel.find({}).limit(3);
        if (products.length === 0) {
            console.log('No products found. Please run seedProducts.js first');
            process.exit(1);
        }

        // Clear existing test orders
        await orderModel.deleteMany({});
        console.log('Cleared existing orders');

        // Create sample orders
        const sampleOrders = [
            {
                userId: testUser._id,
                userName: testUser.name,
                userEmail: testUser.email,
                userPhone: testUser.phone || '+91 9876543210',
                items: [
                    {
                        productId: products[0]._id,
                        productName: products[0].name,
                        productImage: products[0].images[0] || '',
                        quantity: 2,
                        days: 3,
                        pricePerDay: products[0].pricePerDay,
                        totalPrice: products[0].pricePerDay * 2 * 3,
                    },
                    {
                        productId: products[1]._id,
                        productName: products[1].name,
                        productImage: products[1].images[0] || '',
                        quantity: 1,
                        days: 3,
                        pricePerDay: products[1].pricePerDay,
                        totalPrice: products[1].pricePerDay * 1 * 3,
                    },
                ],
                totalAmount: (products[0].pricePerDay * 2 * 3) + (products[1].pricePerDay * 1 * 3),
                status: 'pending',
                eventDate: new Date('2026-02-15'),
                eventLocation: 'Grand Convention Center, Mumbai',
                deliveryAddress: {
                    street: '123 MG Road',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001',
                },
                notes: 'Please ensure timely delivery. Event starts at 6 PM.',
                paymentStatus: 'pending',
                statusHistory: [{
                    status: 'pending',
                    updatedAt: new Date(),
                    notes: 'Order placed by customer',
                }],
            },
            {
                userId: testUser._id,
                userName: 'Corporate Events Ltd',
                userEmail: 'events@corporate.com',
                userPhone: '+91 9988776655',
                items: [
                    {
                        productId: products[2]._id,
                        productName: products[2].name,
                        productImage: products[2].images[0] || '',
                        quantity: 5,
                        days: 2,
                        pricePerDay: products[2].pricePerDay,
                        totalPrice: products[2].pricePerDay * 5 * 2,
                    },
                ],
                totalAmount: products[2].pricePerDay * 5 * 2,
                status: 'confirmed',
                eventDate: new Date('2026-02-10'),
                eventLocation: 'Hotel Taj, Delhi',
                deliveryAddress: {
                    street: '456 Connaught Place',
                    city: 'New Delhi',
                    state: 'Delhi',
                    pincode: '110001',
                },
                notes: 'Annual corporate meeting',
                paymentStatus: 'partial',
                advanceAmount: (products[2].pricePerDay * 5 * 2) * 0.3, // 30% advance
                statusHistory: [
                    {
                        status: 'pending',
                        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        notes: 'Order placed',
                    },
                    {
                        status: 'confirmed',
                        updatedAt: new Date(),
                        notes: 'Payment received, order confirmed',
                    },
                ],
            },
            {
                userId: testUser._id,
                userName: 'Wedding Planners Inc',
                userEmail: 'contact@weddingplanners.com',
                userPhone: '+91 8877665544',
                items: products.slice(0, 2).map(product => ({
                    productId: product._id,
                    productName: product.name,
                    productImage: product.images[0] || '',
                    quantity: 3,
                    days: 4,
                    pricePerDay: product.pricePerDay,
                    totalPrice: product.pricePerDay * 3 * 4,
                })),
                totalAmount: products.slice(0, 2).reduce((sum, p) => sum + (p.pricePerDay * 3 * 4), 0),
                status: 'completed',
                eventDate: new Date('2026-01-20'),
                eventLocation: 'Destination Wedding Resort, Goa',
                deliveryAddress: {
                    street: 'Beach Road',
                    city: 'Panaji',
                    state: 'Goa',
                    pincode: '403001',
                },
                notes: 'Destination wedding - 3 day event',
                paymentStatus: 'paid',
                statusHistory: [
                    {
                        status: 'pending',
                        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                        notes: 'Order placed',
                    },
                    {
                        status: 'confirmed',
                        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
                        notes: 'Confirmed',
                    },
                    {
                        status: 'delivered',
                        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                        notes: 'Items delivered',
                    },
                    {
                        status: 'completed',
                        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        notes: 'Event completed, items returned',
                    },
                ],
            },
        ];

        const result = await orderModel.insertMany(sampleOrders);
        console.log(`✅ Successfully seeded ${result.length} orders`);
        
        result.forEach(order => {
            console.log(`  - Order #${order._id.toString().slice(-8).toUpperCase()} - ${order.userName} - ₹${order.totalAmount} - ${order.status}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding orders:', error);
        process.exit(1);
    }
};

seedOrders();
