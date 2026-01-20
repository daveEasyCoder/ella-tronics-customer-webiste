// routes/productRoutes.js
import express from 'express';
import { adminLogin, getDashboardStats, getRecentActivities, logout } from '../controllers/adminController.js';
import { adminAuth } from '../config/authMiddleware.js';


const router = express.Router();

router.post('/admin-login',adminLogin);
router.post('/admin-logout', adminAuth, logout);

router.get('/dashboard-stats', adminAuth, getDashboardStats);
router.get('/dashboard-activities', adminAuth, getRecentActivities);



export default router;