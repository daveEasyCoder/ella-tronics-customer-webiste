// routes/productRoutes.js
import express from 'express';
import { upload } from '../config/cloudinary.js';
import { createProduct, deleteProduct, editProduct, getAllProducts, getSingleProduct } from '../controllers/productController.js';
import { adminAuth } from '../config/authMiddleware.js';


const router = express.Router();

router.post('/create-product', adminAuth, upload.single('image'), createProduct);
router.get('/get-all-products', getAllProducts); // for general use
router.get('/admin-get-all-products', adminAuth, getAllProducts); // for admin use
router.get('/get-single-product/:id', getSingleProduct);
router.put('/edit-product/:id', adminAuth, upload.single('image'), editProduct);
router.delete('/delete-product/:id', adminAuth, deleteProduct);

export default router;