import express from "express";
import {
  getAllTags,
  getPopularTags,
  getTagByName,
} from "../controllers/tagController.js";

const router = express.Router();

router.get("/", getAllTags);
router.get("/popular", getPopularTags);
router.get("/:name", getTagByName);

export default router;
