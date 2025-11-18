import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import User from "../models/User.js";

export const createAnswer = async (req, res) => {
  try {
    const { body, questionId } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    const answer = await Answer.create({
      body,
      author: req.user._id,
      question: questionId,
    });

    question.answers.push(answer._id);
    await question.save();

    const populatedAnswer = await Answer.findById(answer._id).populate(
      "author",
      "username avatar reputation"
    );

    res.status(201).json({ success: true, data: populatedAnswer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res
        .status(404)
        .json({ success: false, message: "Answer not found" });
    }

    if (answer.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    answer.body = req.body.body || answer.body;
    await answer.save();

    const updatedAnswer = await Answer.findById(answer._id).populate(
      "author",
      "username avatar reputation"
    );

    res.json({ success: true, data: updatedAnswer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res
        .status(404)
        .json({ success: false, message: "Answer not found" });
    }

    if (answer.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answer._id },
    });

    await answer.deleteOne();

    res.json({ success: true, message: "Answer deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const voteAnswer = async (req, res) => {
  try {
    const { vote } = req.body;
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res
        .status(404)
        .json({ success: false, message: "Answer not found" });
    }

    const userId = req.user._id;
    const upvoteIndex = answer.upvotedBy.indexOf(userId);
    const downvoteIndex = answer.downvotedBy.indexOf(userId);

    if (vote === "up") {
      if (upvoteIndex > -1) {
        answer.upvotedBy.splice(upvoteIndex, 1);
        answer.votes -= 1;
      } else {
        if (downvoteIndex > -1) {
          answer.downvotedBy.splice(downvoteIndex, 1);
          answer.votes += 1;
        }
        answer.upvotedBy.push(userId);
        answer.votes += 1;
        await User.findByIdAndUpdate(answer.author, {
          $inc: { reputation: 10 },
        });
      }
    } else if (vote === "down") {
      if (downvoteIndex > -1) {
        answer.downvotedBy.splice(downvoteIndex, 1);
        answer.votes += 1;
      } else {
        if (upvoteIndex > -1) {
          answer.upvotedBy.splice(upvoteIndex, 1);
          answer.votes -= 1;
        }
        answer.downvotedBy.push(userId);
        answer.votes -= 1;
        await User.findByIdAndUpdate(answer.author, {
          $inc: { reputation: -2 },
        });
      }
    }

    await answer.save();

    res.json({ success: true, data: { votes: answer.votes } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res
        .status(404)
        .json({ success: false, message: "Answer not found" });
    }

    const question = await Question.findById(answer.question);

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only question author can accept answers",
      });
    }

    // Unaccept previous answer if exists
    if (question.acceptedAnswer) {
      await Answer.findByIdAndUpdate(question.acceptedAnswer, {
        isAccepted: false,
      });
    }

    answer.isAccepted = true;
    await answer.save();

    question.acceptedAnswer = answer._id;
    await question.save();

    // Award reputation to answer author
    await User.findByIdAndUpdate(answer.author, { $inc: { reputation: 15 } });

    res.json({ success: true, data: answer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res
        .status(404)
        .json({ success: false, message: "Answer not found" });
    }

    answer.comments.push({
      user: req.user._id,
      text,
    });

    await answer.save();

    const updatedAnswer = await Answer.findById(answer._id).populate(
      "comments.user",
      "username avatar"
    );

    res.json({
      success: true,
      data: updatedAnswer.comments[updatedAnswer.comments.length - 1],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
