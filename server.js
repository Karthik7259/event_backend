import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import Userrouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import OrderRouter from './routes/orderRoute.js';
import collegeMerchandiseRouter from './routes/collegeMerchandiseRoute.js';

// app initialization

const app=express();
const port=process.env.PORT || 5000;
connectDB();
connectCloudinary();

// middlewares
app.use(cors());
app.use(express.json());    


// Use user routes
app.use('/api/user', Userrouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/order',OrderRouter);
app.use('/api/college-merchandise',collegeMerchandiseRouter);

// api  endpoints


app.get('/',(req,res)=>{
    res.send('Gift4Corp Backend is running');
});

app.listen(port,()=>console.log(`Server is running on port ${port}`));