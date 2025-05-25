import express from "express";
import { get } from "mongoose";
import { deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/userController.js";
import { canAccessOwnData } from "../middlewares/canAccessOwnData.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";


const router = express.Router();

router.get("/", authenticate, authorize("admin"), getAllUsers);
router.get("/id/:id", authenticate, authorize("admin","user"),canAccessOwnData, getUserById);
router.put("/update/:id", authenticate, authorize("admin", "user"),canAccessOwnData, updateUser);    
router.delete("/delete/:id", authenticate, authorize("admin","user"),canAccessOwnData, deleteUser);

// router.get("/", getAllUsers);
router.get("/id/:id", getUserById);

export default router
