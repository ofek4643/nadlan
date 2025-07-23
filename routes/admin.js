import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdmin.js";
import {
  getAllUsers,
  blockUser,
  deleteUser,
  getSingleUser,
  updateUserByAdmin,
  getAdminDashboardStats,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authenticate, isAdmin);

router.get("/users", getAllUsers);
router.put("/block/:id", blockUser);
router.delete("/:id", deleteUser);
router.get("/users/:id", getSingleUser);
router.put("/users/:id", updateUserByAdmin);
router.get("/dashboard-stats", getAdminDashboardStats);

export default router;