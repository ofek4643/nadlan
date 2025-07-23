import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import {
  sendViewAlert,
  getAlerts,
  deleteAllAlerts,
  deleteAlertById,
  getNewAlerts,
  markAlertAsRead,
} from "../controllers/alertsController.js";

const router = express.Router();

router.post("/:id", authenticate, sendViewAlert);
router.get("/", authenticate, getAlerts);
router.delete("/", authenticate, deleteAllAlerts);
router.delete("/:id", authenticate, deleteAlertById);
router.get("/new", authenticate, getNewAlerts);
router.put("/:id", authenticate, markAlertAsRead);

export default router;
