import mongoose from "mongoose";
import { User } from "../models/user.js";

export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export async function getUserById(req, res) {
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
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export async function updateUser(req, res) {
  const allowedUpdates = ["username", "email", "phone", "address", "age"];
  const updates = Object.keys(req.body);

  // Check if all updates are allowed
  const isValidOperation = updates.every((field) =>
    allowedUpdates.includes(field)
  );

  // Check if trying to update role without admin privileges
  const isRoleUpdate = "role" in req.body;
  const isAdmin = req.user?.role === "admin";

  if (!isValidOperation || (isRoleUpdate && !isAdmin)) {
    return res.status(400).json({
      message: "Invalid updates.",
      details: {
        allowedFields: allowedUpdates,
        attemptedUpdates: updates,
        isRoleUpdate,
        isAdmin,
      },
    });
  }

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    // Only update allowed fields
    const updateData = {};
    updates.forEach((field) => {
      if (allowedUpdates.includes(field)) {
        updateData[field] = req.body[field];
      }
    });

    // Add role update if user is admin
    if (isRoleUpdate && isAdmin) {
      updateData.role = req.body.role;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true, // Enable mongoose validators
      }
    );

    if (updatedUser) {
      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
export async function deleteUser(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
