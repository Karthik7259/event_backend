import orderModel from "../models/OrderModel.js";
import userModel from "../models/userModel.js";

// placing orders using COD METHOD

const placeOrder=async(req,res)=>{
    
try{


    const {userId,items,amount,address}=req.body;

    const orderData={
        userId,
        items,
        address,
        amount,
        PaymentMethod:"COD",
        payment:false,
        date:Date.now(),
     
    }


 const newOrder=new orderModel(orderData);
    await newOrder.save();


    
    await userModel.findByIdAndUpdate(userId,{cartData:{}})

    res.json({success:true,message:"Order Placed Successfully"});



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


}catch(err){        
    console.log(err);
    res.status(500).json({success:false,error:err.message});    

}

}



// All orders data for admin panel 

const allOrders=async(req,res)=>{
    try{

    }catch(err){
        console.log(err);
        res.status(500).json({success:false,error:err.message});    
    }
}

// user order Data for frontend 
const userOrders=async(req,res)=>{
    try{

    }catch(err){
        console.log(err);
        res.status(500).json({success:false,error:err.message});    
    }
}


// update order status fom admin panel

const updateStatus=async(req,res)=>{
    try{    

    }catch(err){
        console.log(err);
        res.status(500).json({success:false,error:err.message});    
    }
}


export {placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrders,updateStatus};