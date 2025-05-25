
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/user.js";
import { Cart } from "../models/cart.js";
import { Order } from "../models/order.js";

export const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });


  
export const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
}
