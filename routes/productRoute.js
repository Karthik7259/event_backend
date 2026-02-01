import express from 'express';

import  {addProduct, listProducts, removeProduct, singleProduct, getProductById, updateProduct, fixNegativeStock, getProductsByCategory, addReview} from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import authuser from '../middleware/auth.js';

const productRouter=express.Router();

productRouter.post('/add',adminAuth,upload.fields([
	{ name: 'images', maxCount: 4 },
	{ name: 'image1', maxCount: 1 },
	{ name: 'image2', maxCount: 1 },
	{ name: 'image3', maxCount: 1 },
	{ name: 'image4', maxCount: 1 }
]),addProduct);
productRouter.put('/update',adminAuth,upload.fields([
	{ name: 'images', maxCount: 4 },
	{ name: 'image1', maxCount: 1 },
	{ name: 'image2', maxCount: 1 },
	{ name: 'image3', maxCount: 1 },
	{ name: 'image4', maxCount: 1 }
]),updateProduct);
productRouter.put('/update/:id',adminAuth,upload.fields([
	{ name: 'images', maxCount: 4 },
	{ name: 'image1', maxCount: 1 },
	{ name: 'image2', maxCount: 1 },
	{ name: 'image3', maxCount: 1 },
	{ name: 'image4', maxCount: 1 }
]),updateProduct);
productRouter.delete('/remove',adminAuth,removeProduct);
productRouter.delete('/delete/:id',adminAuth,removeProduct);
productRouter.post('/single',singleProduct);
productRouter.get('/list',listProducts);
productRouter.get('/category/:category',getProductsByCategory);
productRouter.post('/review/:id',authuser,addReview);
productRouter.get('/:id',getProductById);
productRouter.post('/fix-negative-stock',adminAuth,fixNegativeStock);

export default productRouter;


