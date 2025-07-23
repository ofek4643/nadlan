import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import {
  getUserInfo,
  verifyPassword,
  updateUserInfo,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", authenticate, getUserInfo);
router.post("/verify-password", authenticate, verifyPassword);
router.put("/update-information", authenticate, updateUserInfo);

export default router;