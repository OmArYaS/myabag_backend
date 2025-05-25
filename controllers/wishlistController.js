import { User } from "../models/user.js";

export async function getwishlist(req, res) {
  const { id } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);
    if (user) {
      res.status(200).json(user.wishlist);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export async function addToWishlist(req, res) {
  const { id } = req.params;
  const requestingUser = req.user; // من التوكن
  const requestedId = id; // من الرابط

  if (requestingUser.role !== "admin" && requestingUser.id !== requestedId) {
    return res.status(403).json({ message: "Access denied." });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);
    if (user) {
      user.wishlist.push(req.body.productId);
      await user.save();
      res.status(200).json(user.wishlist);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export async function removeFromWishlist(req, res) {
  const { id } = req.params;
  const requestingUser = req.user; // من التوكن
  const requestedId = id; // من الرابط

  if (requestingUser.role !== "admin" && requestingUser.id !== requestedId) {
    return res.status(403).json({ message: "Access denied." });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);
    if (user) {
      user.wishlist = user.wishlist.filter(
        (productId) => productId.toString() !== req.body.productId
      );
      await user.save();
      res.status(200).json(user.wishlist);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export async function clearWishlist(req, res) {
  const { id } = req.params;
  const requestingUser = req.user; // من التوكن
  const requestedId = id; // من الرابط

  if (requestingUser.role !== "admin" && requestingUser.id !== requestedId) {
    return res.status(403).json({ message: "Access denied." });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);
    if (user) {
      user.wishlist = [];
      await user.save();
      res.status(200).json(user.wishlist);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
