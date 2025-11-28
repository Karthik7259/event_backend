import orderModel from "../models/OrderModel.js";
import userModel from "../models/userModel.js";
import razorpay from "razorpay";
// placing orders using COD METHOD

const currency='inr'
const deliveryCharges=10

/// gateway intialization


const razorpayInstance =new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})
const placeOrder=async(req,res)=>{



    
try{


    const {userId,items,amount,address}=req.body;

    const orderData={
        userId,
        items,
        address,
        amount,
        paymentMethod:"COD",
        payment:false,
        date:Date.now(),
     
    }


 const newOrder=new orderModel(orderData);
    await newOrder.save();



    await userModel.findByIdAndUpdate(userId,{cartData:{}})

    res.json({success:true,message:"Order Placed "});



}catch(err){        
    console.log(err);
    res.status(500).json({success:false,error:err.message});    

}

}
// placing orders using STRIPE METHOD

const placeOrderStripe=async(req,res)=>{
    
try{


}catch(err){        
    console.log(err);
    res.status(500).json({success:false,error:err.message});    

}

}

// placing orders using RAZORPAY METHOD
const placeOrderRazorpay=async(req,res)=>{
    
try{

    const {userId,items,amount,address}=req.body;
    const {origin}=req.headers;

    const orderData={
        userId,
        items,
        address,
        amount,
        paymentMethod:"Razorpay",
        payment:false,
        date:Date.now(),
    }
    const newOrder=new orderModel(orderData);
    await newOrder.save();

     const options={
        amount:amount*100,
        currency:currency.toUpperCase(),
        receipt:newOrder._id.toString(),
     }

     await razorpayInstance.orders.create(options,(err,order)=>{

        if(err){
           console.log(err);
              return res.status(500).json({success:false,message:err.message});
        }

        res.json({success:true,order})


     })

    

}catch(err){        
    console.log(err);
    res.status(500).json({success:false,error:err.message});    

}

}

const verifyRazor=async(req,res)=>{
     try{

        const {response}=req.body;
        const {razorpay_order_id} = response ;

        console.log("Verify Razorpay request:", req.body);

        if(!razorpay_order_id){
            return res.status(400).json({success:false,message:"Order ID is required"});
        }

        const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id); 
        console.log("Order Info:", orderInfo);
        
         if(orderInfo.status==="paid"){
            await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
            const userId = req.body.userId || req.userId;
            if(userId){
                await userModel.findByIdAndUpdate(userId,{cartData:{}});
            }
            res.json({success:true,message:"Payment Successful" });
         }else{
            res.json({success:false,message:"Payment Failed"});
         }

     }catch(err){
        console.log(err);
        res.status(500).json({success:false,error:err.message});    
     }
}

// All orders data for admin panel 

const allOrders=async(req,res)=>{
    try{

        const orders = await orderModel.find({});
        res.json({success:true,orders});
    }catch(err){
        console.log(err);
        res.status(500).json({success:false,error:err.message});    
    }
}

// user order Data for frontend 
const userOrders=async(req,res)=>{
    try{
      

      const {userId}=req.body;

      const orders=await orderModel.find({userId});  
      
       res.json({success:true,orders});

    }catch(err){
        console.log(err);
        res.status(500).json({success:false,error:err.message});    
    }
}


// update order status fom admin panel

const updateStatus=async(req,res)=>{
    try{    

         const {orderId,status}=req.body;
        
        await orderModel.findByIdAndUpdate(orderId,{status});
        res.json({success:true,message:"Status updated"});
        
        }catch(err){
        console.log(err);
        res.status(500).json({success:false,error:err.message});    
    }
}


export {placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrders,updateStatus,verifyRazor};