import express from "express";
import {
  getAllUsers,
  getUserProfile,
  updateProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserProfile);
router.put("/profile", protect, updateProfile);

export default router;
