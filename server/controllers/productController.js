// controllers/productController.js

import { cloudinary } from '../config/cloudinary.js';
import mongoose from 'mongoose';
import {Product} from '../model/schema.js'

// Helper function to delete image from Cloudinary
const deleteCloudinaryImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    
    // Extract public_id from Cloudinary URL
    const publicId = imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`products/${publicId}`);
  } catch (error) {
    console.error('Error deleting Cloudinary image:', error);
  }
};

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      price, 
      color, 
      description,
      location, 
      contact1, 
      contact2, 
      telegram 
    } = req.body;

    // Validation
    if (!name || !price || !location || !contact1) {
      // If there's an uploaded file, delete it
      if (req.file) {
        await deleteCloudinaryImage(req.file.path);
      }
      
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, price, location, contact1"
      });
    }

    // Check if image is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required"
      });
    }

    // Create new product
    const product = new Product({
      name,
      image: req.file.path, // Single image URL
      price: Number(price),
      color: color || "",
      description,
      location,
      contact1,
      contact2: contact2 || "",
      telegram: telegram || ""
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    console.error("Create Product Error:", error);
    
    // Cleanup uploaded image if error occurs
    if (req.file) {
      await deleteCloudinaryImage(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Get Single Product
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .select('-__v'); 
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// Edit/Update Product
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      price, 
      color, 
      description,
      location, 
      contact1, 
      contact2, 
      telegram,
      status,
      keepCurrentImage = 'true' // Flag to keep current image
    } = req.body;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    // Find product
    const product = await Product.findById(id);
    if (!product) {
      // Cleanup uploaded image if product not found
      if (req.file) {
        await deleteCloudinaryImage(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const oldImageUrl = product.image;
    let newImageUrl = oldImageUrl;

    // Handle new image upload
    if (req.file) {
      newImageUrl = req.file.path;
      // Delete old image from Cloudinary
      if (oldImageUrl && keepCurrentImage !== 'true') {
        await deleteCloudinaryImage(oldImageUrl);
      }
    }

    // Update product fields
    const updatedFields = {
      name: name !== undefined ? name : product.name,
      price: price !== undefined ? Number(price) : product.price,
      color: color !== undefined ? color : product.color,
      description: description !== undefined ? description : product.description,
      location: location !== undefined ? location : product.location,
      contact1: contact1 !== undefined ? contact1 : product.contact1,
      contact2: contact2 !== undefined ? contact2 : product.contact2,
      telegram: telegram !== undefined ? telegram : product.telegram,
      status: status !== undefined ? status : product.status,
      image: newImageUrl
    };

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });

  } catch (error) {
    console.error("Edit Product Error:", error);
    
    // Cleanup newly uploaded image if error occurs
    if (req.file) {
      await deleteCloudinaryImage(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Delete image from Cloudinary
    if (product.image) {
      await deleteCloudinaryImage(product.image);
    }

    // Delete product from database
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
