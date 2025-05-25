import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(productId.toString())) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the requested quantity is available
    const cart = await Cart.findOne({ userId });

    let currentQuantityInCart = 0;

    if (cart) {
      const existingProduct = cart.products.find(
        (item) => item.productId.toString() === productId
      );
      if (existingProduct) {
        currentQuantityInCart = existingProduct.quantity;
      }
    }

    const totalRequested = currentQuantityInCart + quantity;
    // if (totalRequested > product.stock) {
    //   return res.status(400).json({ message: "Not enough stock available" });
    // }

    // Add or update cart
    if (cart) {
      const existingProduct = cart.products.find(
        (item) => item.productId.toString() === productId
      );
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
      await cart.save();
    } else {
      const newCart = new Cart({
        userId,
        products: [{ productId, quantity }],
      });
      await newCart.save();
    }

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("🛒 addToCart error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart || cart.products.length === 0) {
      return res.status(200).json({ message: "Cart is empty" });
    }

    const totalQuantity = cart.products.reduce(
      (total, item) => total + item.quantity,
      0
    );

    const totalPrice = cart.products.reduce((total, item) => {
      return total + item.quantity * (item.productId?.price || 0);
    }, 0);

    res.status(200).json({
      cart: cart.products.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
        product: item.productId,
      })),
      totalQuantity,
      totalPrice,
    });
  } catch (error) {
    console.error("🛒 getCart error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // فقط احذف المنتج من الكارت بدون تعديل المخزون
    cart.products.splice(productIndex, 1);
    await cart.save();

    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("🛒 removeFromCart error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // فقط امسح محتويات الكارت
    cart.products = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("🛒 clearCart error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    console.log(productId);
    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() == productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if requested quantity is available
    if (quantity > product.stock) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Remove item if quantity is 0 or less
    if (quantity < 1) {
      cart.products.splice(productIndex, 1);
    } else {
      cart.products[productIndex].quantity = quantity;
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("🛒 updateCart error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkout = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Separate available and unavailable products
    const availableProducts = [];
    const unavailableProducts = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = item.productId;
      if (!product) {
        unavailableProducts.push({
          name: "Unknown Product",
          reason: "Product not found",
        });
        continue;
      }

      if (item.quantity > product.stock) {
        unavailableProducts.push({
          name: product.name,
          reason: `Only ${product.stock} items available`,
          requested: item.quantity,
          available: product.stock,
        });
        continue;
      }

      availableProducts.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
      });
      totalAmount += product.price * item.quantity;
    }

    // If no products are available, return early
    if (availableProducts.length === 0) {
      return res.status(400).json({
        message: "No products available for checkout",
        unavailableProducts,
      });
    }

    // Create order with available products
    const order = new Order({
      userId,
      products: availableProducts.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalAmount,
      status: "Pending",
    });

    await order.save();

    // Update stock for available products
    for (const item of availableProducts) {
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    // Get the IDs of products that were ordered
    const orderedProductIds = availableProducts.map((item) => item.productId);

    // Update cart using atomic operation
    const updatedCart = await Cart.findOneAndUpdate(
      { _id: cart._id },
      {
        $pull: {
          products: {
            productId: {
              $in: orderedProductIds,
            },
          },
        },
      },
      { new: true }
    );

    // If cart is empty after update, delete it
    if (!updatedCart || updatedCart.products.length === 0) {
      await Cart.deleteOne({ _id: cart._id });
    }

    res.status(200).json({
      message: "Checkout partially successful",
      orderId: order._id,
      totalAmount,
      unavailableProducts,
      availableProducts: availableProducts.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  } catch (error) {
    console.error("❌ Checkout error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCartCount = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({
      userId,
    });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const count = cart.products.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
//     const resetToken = crypto.randomBytes(20).toString("hex");
//   user.resetPasswordToken = resetToken;
