import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import Userrouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import orderRouter from './routes/orderRoute.js';

// app initialization

const app=express();
const port=process.env.PORT || 5000;
connectDB();
connectCloudinary();

// middlewares
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:8080',
        'http://localhost:5174',
        'http://localhost:3000',
        'https://yourcampusmerch.com',
        'https://gift4corp-admin.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));    


// Use user routes
app.use('/api/user', Userrouter);
app.use('/api/product',productRouter);
app.use('/api/order',orderRouter);

// api  endpoints



app.get('/',(req,res)=>{
    res.send('YourCampusMerch Backend is running');
});

app.listen(port,()=>console.log(`Server is running on port ${port}`));