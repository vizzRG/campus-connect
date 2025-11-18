import express from "express";
import {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  voteAnswer,
  acceptAnswer,
  addComment,
} from "../controllers/answerController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createAnswer);
router.put("/:id", protect, updateAnswer);
router.delete("/:id", protect, deleteAnswer);
router.post("/:id/vote", protect, voteAnswer);
router.post("/:id/accept", protect, acceptAnswer);
router.post("/:id/comments", protect, addComment);

export default router;
