import express from "express";
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  voteQuestion,
  addComment,
} from "../controllers/questionController.js";
import { protect, optional } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(optional, getAllQuestions).post(protect, createQuestion);

router
  .route("/:id")
  .get(optional, getQuestionById)
  .put(protect, updateQuestion)
  .delete(protect, deleteQuestion);

router.post("/:id/vote", protect, voteQuestion);
router.post("/:id/comments", protect, addComment);

export default router;
