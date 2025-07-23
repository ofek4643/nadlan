import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import {
  toggleFavoriteProperty,
  getFavoriteProperties,
} from "../controllers/favoriteController.js";

const router = express.Router();

router.post("/", authenticate, toggleFavoriteProperty);
router.get("/", authenticate, getFavoriteProperties);

export default router;
