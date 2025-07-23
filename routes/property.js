import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import {
  addProperty,
  editProperty,
  getPropertyById,
  listProperties,
  filterProperties,
  getMyProperties,
  deleteProperty,
} from "../controllers/propertyController.js";

const router = express.Router();
router.post("/add-property", authenticate, addProperty);
router.put("/:id", authenticate, editProperty);
router.get("/my-properties", authenticate, getMyProperties);
router.get("/", listProperties);
router.post("/filter", filterProperties);
router.delete("/:id", authenticate, deleteProperty);
router.get("/:id", getPropertyById)

export default router;
