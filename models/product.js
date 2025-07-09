import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: {
    type: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    required: true,
  },
  brand: {
    type: String,
    required: false,
  },
  stock: {
    type: Number,
    required: false,
  },
  color: {
    type: [String],
    required: false,
  },
  size: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


export const Product = mongoose.model("Product", productSchema);
