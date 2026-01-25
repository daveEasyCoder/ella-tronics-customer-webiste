import mongoose from "mongoose";
// --------- Product Schema ---------
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, default: "", trim: true },
    color: { type: String, trim: true, default: "" },
    location: { type: String, required: true, trim: true },
    contact1: { type: String, required: true, trim: true },
    contact2: { type: String, trim: true, default: "" },
    telegram: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["available", "sold"], default: "available" },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);


// --------- User Schema (example) ---------
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// --------- Testimonial Schema (Service-level) ---------
const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, 
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export { Product, User,Testimonial };