import express from "express";
import { get } from "mongoose";
import { deleteOrder, getAllOrders, getOrder, getOrders, updateOrderStatus } from "../controllers/orderController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";


const router = express.Router();

router.get("/user", authenticate, authorize("admin", "user"), getOrder);
router.get("/all/user", authenticate, authorize("admin", "user"), getOrders);
router.get("/all/users", authenticate, authorize("admin"), getAllOrders);
router.patch("/update/:orderId", authenticate, authorize("admin"), updateOrderStatus);
router.delete("/delete/:orderId", authenticate, authorize("admin"), deleteOrder);

export default router;