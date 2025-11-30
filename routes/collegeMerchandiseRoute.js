import express from 'express';
import { addCollegeMerchandise, listCollegeMerchandise, deleteCollegeMerchandise } from '../controllers/collegeMerchandiseController.js';
import adminAuth from '../middleware/adminAuth.js';

const collegeMerchandiseRouter = express.Router();

collegeMerchandiseRouter.post('/add', adminAuth, addCollegeMerchandise);
collegeMerchandiseRouter.get('/list', listCollegeMerchandise);
collegeMerchandiseRouter.post('/delete', adminAuth, deleteCollegeMerchandise);

export default collegeMerchandiseRouter;
