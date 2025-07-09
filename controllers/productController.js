import mongoose from "mongoose";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadMultipleToCloudinary } from "../middlewares/upload.js";
import { v2 as cloudinary } from "cloudinary";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getProducts(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      category,
      name,
      minPrice,
      maxPrice,
    } = req.query;

    const filter = {};

    if (category) filter.category = new mongoose.Types.ObjectId(category);

    if (name) filter.name = new RegExp(name, "i");

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("category");

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      data: products,
      page: parseInt(page),
      totalPages: Math.ceil(limit == 0 ? 1 : total / limit),
      totalItems: total,
      length: products.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export async function getProductById(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const data = await Product.findById(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function createProduct(req, res) {
  const { name, brand, stock, color, size, price, description, category } =
    req.body;

  // Ensure images are uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "At least one image is required" });
  }

  if (!name || !price || !description || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // رفع الصور إلى Cloudinary
    const uploadedImages = await uploadMultipleToCloudinary(req.files); // [{url, public_id}]

    const newProduct = new Product({
      name,
      images: uploadedImages, // array of {url, public_id}
      brand,
      stock,
      color,
      size,
      price,
      description,
      category,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function updateProduct(req, res) {
  const { id } = req.params;
  const cleanBody = {};
  Object.entries(req.body).forEach(([key, value]) => {
    if (
      value !== "" &&
      value !== "null" &&
      value !== undefined &&
      value !== "0"
    ) {
      cleanBody[key] = value;
    }
  });

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    // If new images are uploaded, handle image replacement
    if (req.files && req.files.length > 0) {
      // Get the existing product to delete old images from Cloudinary
      const existingProduct = await Product.findById(id);
      if (
        existingProduct &&
        existingProduct.images &&
        Array.isArray(existingProduct.images)
      ) {
        // Delete old images from Cloudinary
        for (const imgObj of existingProduct.images) {
          try {
            if (imgObj.public_id) {
              await cloudinary.uploader.destroy(imgObj.public_id);
            }
          } catch (error) {
            console.error("Error deleting old image from Cloudinary:", error);
            // Continue even if image deletion fails
          }
        }
      }

      // رفع الصور الجديدة إلى Cloudinary
      const uploadedImages = await uploadMultipleToCloudinary(req.files); // [{url, public_id}]
      cleanBody.images = uploadedImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, cleanBody, {
      new: true,
    });
    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error45", error: error.message });
  }
}

export async function deleteProduct(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    // Check if user orders that product before delete
    const orders = await Order.find({ "products.productId": id });
    if (orders.length > 0) {
      return res.status(400).json({ message: "Product has orders" });
    }

    //remove the product's images from Cloudinary
    const product = await Product.findById(id);
    if (product && product.images && Array.isArray(product.images)) {
      for (const imgObj of product.images) {
        try {
          if (imgObj.public_id) {
            await cloudinary.uploader.destroy(imgObj.public_id);
          }
        } catch (error) {
          console.error("Error deleting image from Cloudinary:", error);
          // Continue with product deletion even if image deletion fails
        }
      }
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (deletedProduct) {
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getProductByCategory(req, res) {
  const { category } = req.params;

  try {
    const products = await Product.find({ category });
    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: "No products found in this category" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
