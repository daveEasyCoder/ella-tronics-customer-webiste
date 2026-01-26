// routes/productRoutes.js
import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';


const router = express.Router();

router.post('/register',registerUser);
router.post('/login-user',loginUser);




export default router;