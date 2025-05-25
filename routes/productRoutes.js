import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/id/:id", getProductById);
router.post("/add",upload.single("image"), authenticate, authorize("admin"), createProduct);
router.put("/update/:id",upload.single("image"), authenticate, authorize("admin"), updateProduct);
router.delete("/delete/:id", authenticate, authorize("admin"), deleteProduct);

export default router;
