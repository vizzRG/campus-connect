import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import User from "../models/User.js";

export const getAllQuestions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = "-createdAt",
      tag,
      search,
    } = req.query;

    const query = { isActive: true };

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const questions = await Question.find(query)
      .populate("author", "username avatar reputation")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Question.countDocuments(query);

    res.json({
      success: true,
      data: questions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("author", "username avatar reputation bio")
      .populate({
        path: "answers",
        populate: {
          path: "author",
          select: "username avatar reputation",
        },
      })
      .populate("comments.user", "username avatar");

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    // Increment views
    question.views += 1;
    await question.save();

    res.json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const { title, body, tags } = req.body;

    const question = await Question.create({
      title,
      body,
      tags,
      author: req.user._id,
    });

    const populatedQuestion = await Question.findById(question._id).populate(
      "author",
      "username avatar reputation"
    );

    res.status(201).json({ success: true, data: populatedQuestion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const { title, body, tags } = req.body;

    question.title = title || question.title;
    question.body = body || question.body;
    question.tags = tags || question.tags;

    await question.save();

    const updatedQuestion = await Question.findById(question._id).populate(
      "author",
      "username avatar reputation"
    );

    res.json({ success: true, data: updatedQuestion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    question.isActive = false;
    await question.save();

    res.json({ success: true, message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const voteQuestion = async (req, res) => {
  try {
    const { vote } = req.body; // 'up' or 'down'
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    const userId = req.user._id;
    const upvoteIndex = question.upvotedBy.indexOf(userId);
    const downvoteIndex = question.downvotedBy.indexOf(userId);

    if (vote === "up") {
      if (upvoteIndex > -1) {
        // Remove upvote
        question.upvotedBy.splice(upvoteIndex, 1);
        question.votes -= 1;
      } else {
        // Add upvote
        if (downvoteIndex > -1) {
          question.downvotedBy.splice(downvoteIndex, 1);
          question.votes += 1;
        }
        question.upvotedBy.push(userId);
        question.votes += 1;

        // Update author reputation
        await User.findByIdAndUpdate(question.author, {
          $inc: { reputation: 10 },
        });
      }
    } else if (vote === "down") {
      if (downvoteIndex > -1) {
        // Remove downvote
        question.downvotedBy.splice(downvoteIndex, 1);
        question.votes += 1;
      } else {
        // Add downvote
        if (upvoteIndex > -1) {
          question.upvotedBy.splice(upvoteIndex, 1);
          question.votes -= 1;
        }
        question.downvotedBy.push(userId);
        question.votes -= 1;

        // Update author reputation
        await User.findByIdAndUpdate(question.author, {
          $inc: { reputation: -2 },
        });
      }
    }

    await question.save();

    res.json({ success: true, data: { votes: question.votes } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    question.comments.push({
      user: req.user._id,
      text,
    });

    await question.save();

    const updatedQuestion = await Question.findById(question._id).populate(
      "comments.user",
      "username avatar"
    );

    res.json({
      success: true,
      data: updatedQuestion.comments[updatedQuestion.comments.length - 1],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
