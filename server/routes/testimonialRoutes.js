// routes/productRoutes.js
import express from 'express';

import { approveTestimonial, createTestimonial, deleteTestimonial, getTestimonials, getTestimonialStats, updateTestimonial } from '../controllers/testimonialController.js';


const router = express.Router();

router.post('/create-testimonial', createTestimonial);
router.get('/get-testimonials', getTestimonials);
router.delete('/delete-testimonial/:id', deleteTestimonial);
router.put('/approve-testimonial/:id', approveTestimonial);
router.put('/update-testimonial/:id', updateTestimonial);
router.get('/testimonial-stats', getTestimonialStats);


export default router;