import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/ProductModel.js';
// function for add product

// const addProduct = async (req, res) => {
//    try{
//           const {name,description,price,Mrpprice,category,subCategory,sizes,bestseller,collegeMerchandise} =req.body;

//           const image1=req.files.image1 && req.files.image1[0] ;
//           const image2=req.files.image2 && req.files.image2[0] ;
//           const image3=req.files.image3 && req.files.image3[0] ;
//           const image4=req.files.image4 && req.files.image4[0] ;

//           console.log("collegeMerchandise:", collegeMerchandise);

//           const images=[image1,image2,image3,image4].filter((item)=> item !== undefined);
 

//            let imagesUrl=await Promise.all(
//             images.map(async (item)=>{
//                 let result=await cloudinary.uploader.upload(item.path,{resource_type:"image"});

//                 return result.secure_url;
//             })
//            )


//           const productData = {
//             name,
//             description,
//             category,
//             subCategory,
//             sizes,
//             bestseller:bestseller === 'true' ? true : false,
//             collegeMerchandise,
//             price:Number(price),
//             Mrpprice:Number(Mrpprice),
//             sizes : JSON.parse(sizes.replace(/'/g, '"')),
//             image:imagesUrl,
//             date:Date.now(),
//           }



//           const newProduct = new productModel(productData);

//           await newProduct.save();
          

//  res.json({success:true,message:"Product added successfully"})

//    }   catch(err){  
//              console.log(err);
//            res.status(500).json({error:"Internal server error"})
//     }

// };


const addProduct = async (req, res) => {
  try {
    const { 
      name, description, price, Mrpprice, pricePerDay, category, subCategory, 
      sizes, bestseller, collegeMerchandise, quantity, availableQuantity, color, 
      weight, length, breadth, height, brand, useSizeVariants, sizeVariants,
      features, specifications, minimumRentalDays, depositAmount, tags, isAvailable
    } = req.body;

    const image1 = req.files?.image1 && req.files.image1[0];
    const image2 = req.files?.image2 && req.files.image2[0];
    const image3 = req.files?.image3 && req.files.image3[0];
    const image4 = req.files?.image4 && req.files.image4[0];
    const imagesFromArray = req.files?.images ? req.files.images : [];

    const images = [...imagesFromArray, image1, image2, image3, image4].filter(i => i);

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      subCategory: subCategory || '',
      bestseller: bestseller === "true" || bestseller === true,
      collegeMerchandise: collegeMerchandise || '',
      image: imagesUrl,
      images: imagesUrl,
      date: Date.now(),
    };
    
    // Rental pricing (prioritize pricePerDay for rental products)
    if (pricePerDay) {
      productData.pricePerDay = Number(pricePerDay);
    }
    
    // Legacy pricing fields
    if (price) productData.price = Number(price);
    if (Mrpprice) productData.Mrpprice = Number(Mrpprice);
    
    // Inventory
    productData.quantity = quantity ? Number(quantity) : 0;
    productData.availableQuantity = availableQuantity !== undefined ? Number(availableQuantity) : (quantity ? Number(quantity) : 0);
    
    // Additional attributes
    if (color) productData.color = color;
    if (brand) productData.brand = brand;
    
    // Rental-specific fields
    if (features) {
      productData.features = typeof features === 'string' ? JSON.parse(features) : features;
    }
    if (specifications) productData.specifications = specifications;
    if (minimumRentalDays) productData.minimumRentalDays = Number(minimumRentalDays);
    if (depositAmount) productData.depositAmount = Number(depositAmount);
    if (tags) {
      productData.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    }
    if (isAvailable !== undefined) {
      productData.isAvailable = isAvailable === "true" || isAvailable === true;
    }
    
    // Add weight and dimensions if provided
    if(weight) productData.weight = Number(weight);
    if(length) productData.length = Number(length);
    if(breadth) productData.breadth = Number(breadth);
    if(height) productData.height = Number(height);

    // Add sizes only when product has size
    if (sizes) {
      productData.sizes = typeof sizes === 'string' ? JSON.parse(sizes.replace(/'/g, '"')) : sizes;
    }

    // Add size variants if using different pricing for sizes
    if (useSizeVariants === 'true' && sizeVariants) {
      const parsedVariants = typeof sizeVariants === 'string' ? JSON.parse(sizeVariants) : sizeVariants;
      productData.sizeVariants = parsedVariants.map(v => ({
        size: v.size,
        price: Number(v.price),
        mrpPrice: Number(v.mrpPrice),
        quantity: Number(v.quantity)
      }));
    }

    const newProduct = new productModel(productData);
    await newProduct.save();

    res.json({ success: true, message: "Product added successfully", product: newProduct });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Internal server error", message: err.message });
  }
};


// function for get all products
const listProducts = async (req, res) => {
    try{
      const products=await productModel.find({});
      res.json({success:true,products});
    }catch(err){
      console.log(err);
      res.status(500).json({success:false, error:"Internal server error"})
    }
}

// function to get products by category
const getProductsByCategory = async (req, res) => {
    try{
      const { category } = req.params;
      
      // If category is 'all', return all products
      if (category.toLowerCase() === 'all') {
        const products = await productModel.find({});
        return res.json({success:true, products, count: products.length});
      }
      
      // Find products by category (case-insensitive)
      const products = await productModel.find({ 
        category: { $regex: new RegExp(`^${category}$`, 'i') } 
      });
      
      res.json({success:true, products, count: products.length});
    }catch(err){
      console.log(err);
      res.status(500).json({success:false, error:"Internal server error"})
    }
}

// function for removing products
const removeProduct = async (req, res) => {
    try{
         const productId = req.params.id || req.body.id;
         if (!productId) {
           return res.status(400).json({success:false,message:"Product id is required"});
         }
         const product=await productModel.findByIdAndDelete(productId);
         if (!product) {
           return res.status(404).json({success:false,message:"Product not found"});
         }
         res.json({success:true,message:"Product removed successfully"});
    }catch(err){  
        console.log(err); 
      res.status(500).json({success:false,error:"Internal server error"}) 
    }
}

// function for single product info (POST body)
const singleProduct=async(req,res)=>{
  try{
    const {productId} = req.body;
    const product = await productModel.findById(productId);
    
    if(!product){
      return res.status(404).json({success:false, message:"Product not found"});
    }
    
    res.json({success:true, product});
  }catch(err){
    console.log(err);
    res.status(500).json({success:false, error:"Internal server error"});
  }
}

// function for single product info (GET /:id)
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success:false, message:"Product not found" });
    }
    res.json({ success:true, product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success:false, error:"Internal server error" });
  }
}

// function for adding product review
const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userName, rating, comment } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({ success: false, message: "User info is required" });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Valid rating is required" });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: "Comment is required" });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const review = {
      userId,
      userName,
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date()
    };

    const reviews = Array.isArray(product.reviews) ? product.reviews : [];
    reviews.push(review);

    // Update average rating
    const totalRating = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
    const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    product.reviews = reviews;
    product.rating = Number(avgRating.toFixed(1));

    await product.save();

    res.json({ success: true, message: "Review added successfully", product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

// function for updating product
const updateProduct = async (req, res) => {
  try {
    const { 
      id, name, description, price, Mrpprice, pricePerDay, category, subCategory, 
      sizes, bestseller, collegeMerchandise, quantity, availableQuantity, color, brand, 
      useSizeVariants, sizeVariants, deletedImages, features, specifications, 
      minimumRentalDays, depositAmount, tags, isAvailable
    } = req.body;

    const productId = req.params.id || id;
    if (!productId) {
      return res.status(400).json({ success:false, message:"Product id is required" });
    }

    // Find existing product
    const existingProduct = await productModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Handle image uploads if new images are provided
    let imagesUrl = [...existingProduct.image]; // Copy existing images

    // Handle deletedImages (indices)
    let deletedIndices = [];
    if (deletedImages) {
      try {
        deletedIndices = JSON.parse(deletedImages);
      } catch (e) {
        deletedIndices = Array.isArray(deletedImages) ? deletedImages : [];
      }
    }
    // Remove images at specified indices
    if (deletedIndices.length > 0) {
      // Sort descending to avoid index shift
      deletedIndices.sort((a, b) => b - a);
      for (const idx of deletedIndices) {
        if (imagesUrl[idx] !== undefined) {
          imagesUrl.splice(idx, 1);
        }
      }
    }

    // Handle new image uploads (replace at index)
    if (req.files && Object.keys(req.files).length > 0) {
      const uploadedImages = [];
      const imagesFromArray = req.files?.images ? req.files.images : [];
      if (imagesFromArray.length > 0) {
        uploadedImages.push(...imagesFromArray);
      }
      for (let i = 1; i <= 4; i++) {
        const imageFile = req.files[`image${i}`] && req.files[`image${i}`][0];
        if (imageFile) {
          uploadedImages.push(imageFile);
        }
      }

      if (uploadedImages.length > 0) {
        const uploadedUrls = await Promise.all(
          uploadedImages.map(async (item) => {
            let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
            return result.secure_url;
          })
        );
        // Append new images to existing list
        imagesUrl = [...imagesUrl, ...uploadedUrls].filter(Boolean);
      }
    }

    // Prepare update data
    const updateData = {
      name: name || existingProduct.name,
      description: description || existingProduct.description,
      category: category || existingProduct.category,
      subCategory: subCategory !== undefined ? subCategory : existingProduct.subCategory,
      bestseller: bestseller !== undefined ? (bestseller === "true" || bestseller === true) : existingProduct.bestseller,
      collegeMerchandise: collegeMerchandise !== undefined ? collegeMerchandise : existingProduct.collegeMerchandise,
      quantity: quantity !== undefined ? Number(quantity) : existingProduct.quantity,
      color: color !== undefined ? color : existingProduct.color,
      brand: brand !== undefined ? brand : existingProduct.brand,
      image: imagesUrl,
      images: imagesUrl,
    };
    
    // Update rental pricing
    if (pricePerDay !== undefined) updateData.pricePerDay = Number(pricePerDay);
    
    // Legacy pricing
    if (price !== undefined) updateData.price = Number(price);
    if (Mrpprice !== undefined) updateData.Mrpprice = Number(Mrpprice);
    
    // Inventory
    if (availableQuantity !== undefined) updateData.availableQuantity = Number(availableQuantity);
    
    // Rental-specific fields
    if (features !== undefined) {
      updateData.features = typeof features === 'string' ? JSON.parse(features) : features;
    }
    if (specifications !== undefined) updateData.specifications = specifications;
    if (minimumRentalDays !== undefined) updateData.minimumRentalDays = Number(minimumRentalDays);
    if (depositAmount !== undefined) updateData.depositAmount = Number(depositAmount);
    if (tags !== undefined) {
      updateData.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    }
    if (isAvailable !== undefined) {
      updateData.isAvailable = isAvailable === "true" || isAvailable === true;
    }

    // Add sizes only when product has size
    if (sizes) {
      updateData.sizes = typeof sizes === 'string' ? JSON.parse(sizes.replace(/'/g, '"')) : sizes;
    }

    // Handle size variants
    if (useSizeVariants === 'true' && sizeVariants) {
      const parsedVariants = typeof sizeVariants === 'string' ? JSON.parse(sizeVariants) : sizeVariants;
      updateData.sizeVariants = parsedVariants.map(v => ({
        size: v.size,
        price: Number(v.price),
        mrpPrice: Number(v.mrpPrice),
        quantity: Number(v.quantity)
      }));
    } else if (useSizeVariants === 'false') {
      // Clear size variants if disabled
      updateData.sizeVariants = [];
    }

    // Update product
    const updatedProduct = await productModel.findByIdAndUpdate(productId, updateData, { new: true });

    res.json({ success: true, message: "Product updated successfully", product: updatedProduct });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};


// Fix negative stock quantities
const fixNegativeStock = async (req, res) => {
  try {
    const productsWithNegativeStock = await productModel.find({ quantity: { $lt: 0 } });
    
    if (productsWithNegativeStock.length === 0) {
      return res.json({ success: true, message: "No products with negative stock found" });
    }
    
    const updates = [];
    for (const product of productsWithNegativeStock) {
      await productModel.findByIdAndUpdate(product._id, { quantity: 0 });
      updates.push({ name: product.name, oldQuantity: product.quantity, newQuantity: 0 });
    }
    
    res.json({ 
      success: true, 
      message: `Fixed ${updates.length} products with negative stock`,
      updates: updates
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};



export { addProduct, listProducts, removeProduct, singleProduct, getProductById, updateProduct, fixNegativeStock, getProductsByCategory, addReview };