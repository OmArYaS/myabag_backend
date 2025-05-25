import express from "express";
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, getProductsByCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/:id/products", getProductsByCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;