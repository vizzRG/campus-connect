import User from "../models/User.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const questions = await Question.find({ author: user._id, isActive: true })
      .sort("-createdAt")
      .limit(10);

    const answers = await Answer.find({ author: user._id })
      .populate("question", "title")
      .sort("-createdAt")
      .limit(10);

    res.json({
      success: true,
      data: {
        user,
        questions,
        answers,
        stats: {
          questionsCount: await Question.countDocuments({
            author: user._id,
            isActive: true,
          }),
          answersCount: await Answer.countDocuments({ author: user._id }),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { bio, location, website, github, twitter } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio, location, website, github, twitter },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = "-reputation" } = req.query;

    const users = await User.find()
      .select("-password")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments();

    res.json({
      success: true,
      data: users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
