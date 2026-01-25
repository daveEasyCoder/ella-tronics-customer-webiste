

import { Testimonial } from "../model/schema.js";

// @access  Public
export const createTestimonial = async (req, res) => {
  try {
    const { name, message, rating } = req.body;

    // Validation
    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and message'
      });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const testimonial = await Testimonial.create({
      name,
      message,
      rating: rating || 5,
      approved: false 
    });

    res.status(201).json({
      success: true,
      message: 'Submitted successfully. It will appear after admin approval.',
      data: testimonial
    });
  } catch (error) {
    console.error('Create Testimonial Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server error',
      error: error.message
    });
  }
};

// @desc    Get all testimonials (approved only for public)
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    const { admin } = req.query;
    
    let query = {};
    
    // If not admin, only show approved testimonials
    if (!admin || admin !== 'true') {
      query.approved = true;
    }

    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Get Testimonials Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};



export const updateTestimonial = async (req, res) => {
  try {
    const { name, message, rating, approved } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    // Update fields
    if (name) testimonial.name = name;
    if (message) testimonial.message = message;
    if (rating) testimonial.rating = rating;
    if (approved !== undefined) testimonial.approved = approved;

    await testimonial.save();

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Update Testimonial Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete testimonial (admin only)

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete Testimonial Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Approve testimonial (admin only)
export const approveTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    testimonial.approved = true;
    await testimonial.save();

    res.status(200).json({
      success: true,
      message: 'Testimonial approved successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Approve Testimonial Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get testimonial stats (admin only)
export const getTestimonialStats = async (req, res) => {
  try {
    const total = await Testimonial.countDocuments();
    const approved = await Testimonial.countDocuments({ approved: true });
    const pending = await Testimonial.countDocuments({ approved: false });
    
    const avgRating = await Testimonial.aggregate([
      { $match: { approved: true } },
      { $group: { _id: null, average: { $avg: "$rating" } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        approved,
        pending,
        averageRating: avgRating[0]?.average || 0
      }
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
