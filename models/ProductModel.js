import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
      // Basic Information
      name:{
        type:String,
        required:true,
      },
      description:{   
        type:String,
        required:true,
      },
      
      // Rental Pricing (pricePerDay is main rental price)
      pricePerDay:{
        type:Number,
        required:true,
      },
      
      // Legacy pricing fields (for backward compatibility)
      price:{
        type:Number,
      },
      Mrpprice:{
        type:Number,
      },
      
      // Images
      image:{   
        type:Array,
        default:[],
      },
      images:{   
        type:Array,
        default:[],
      },
      
      // Category (for rental: Catering, Decoration, Sound & Lighting, Furniture, Photography, Other)
      category:{
        type:String,
        required:true,
      },
      subCategory:{   
        type:String,
      },
      
      // Rental-specific fields
      features:{
        type:Array,
        default:[],
      },
      specifications:{
        type:String,
      },
      minimumRentalDays:{
        type:Number,
        default:1,
      },
      depositAmount:{
        type:Number,
        default:0,
      },
      
      // Inventory Management
      quantity:{
        type:Number,
        default:0,
      },
      availableQuantity:{
        type:Number,
        default:0,
      },
      
      // Availability Status
      isAvailable:{
        type:Boolean,
        default:true,
      },
      
      // Rating & Reviews
      rating:{
        type:Number,
        default:4.5,
      },
      reviews:{
        type:Array,
        default:[],
      },
      
      // Tags for search and filtering
      tags:{
        type:Array,
        default:[],
      },
      
      // Size variants (for products with multiple sizes)
      sizes:{   
        type:Array,
        default:[],
      },
      sizeVariants:{
        type: Array,
        default: [],
        // Each element: { size: String, price: Number, mrpPrice: Number, quantity: Number }
      },
      
      // Additional attributes
      color:{
        type:String,
      },
      brand:{
        type:String,
      },
      bestseller:{   
        type:Boolean,
        default:false,
      },
      
      // Legacy field (for backward compatibility)
      collegeMerchandise:{   
        type:String,
      },
      
      // Shipping dimensions (for logistics)
      weight:{
        type:Number,
        default:400,
      },
      length:{
        type:Number,
        default:30,
      },
      breadth:{
        type:Number,
        default:27,
      },
      height:{
        type:Number,
        default:2,
      },
      
      // Timestamps
      date:{
        type:Number,
        default:Date.now
      }
    })

const ProductModel = mongoose.models.product || mongoose.model("products",productSchema)
    
export default ProductModel;