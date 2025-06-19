import { Product } from "../models/product.js";
import { Order } from "../models/order.js";
import { Cart } from "../models/cart.js";
import { User } from "../models/user.js";

export const getOrder = async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.orderId;

  try {
    const order = await Order.findOne({ userId, _id: orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("🛒 getOrder error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
//     res.status(500).json({ message: "Server error" });
//   }
export const getOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ userId }).populate("products.productId");
    if (!orders) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("🛒 getOrders error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  const {
    search = "",
    sort = "orderDate",
    order = "desc",
    page = 1,
    limit = 10,
    status = "",
    startDate = "",
    endDate = "",
  } = req.query;

  const query = {};

  // Search filter
  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [{ _id: regex }, { "userId.email": regex }];
  }

  // Status filter
  if (status) {
    query.status = status;
  }

  // Date range filter
  if (startDate || endDate) {
    query.orderDate = {};
    if (startDate) {
      query.orderDate.$gte = new Date(startDate);
    }
    if (endDate) {
      query.orderDate.$lte = new Date(endDate);
    }
  }

  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate("userId", "username email phone age address") // Only populate necessary fields
      .populate("products.productId", "name price images") // Only populate necessary fields
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      data: orders,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (err) {
    console.error("🛒 getAllOrders error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const updateOrderStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body; // status should be one of the enum values

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status;
    await order.save();
    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("🛒 updateOrderStatus error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // return the products to the stock
    const products = order.products;
    for (const product of products) {
      const productId = product.productId;
      const quantity = product.quantity;
      await Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } });
    }
    // delete the order
    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("🛒 deleteOrder error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
