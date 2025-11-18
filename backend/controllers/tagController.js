import Tag from "../models/Tag.js";
import Question from "../models/Question.js";

export const getAllTags = async (req, res) => {
  try {
    const { page = 1, limit = 36, sort = "-count" } = req.query;

    const tags = await Tag.find()
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Tag.countDocuments();

    res.json({
      success: true,
      data: tags,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPopularTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort("-count").limit(20);
    res.json({ success: true, data: tags });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTagByName = async (req, res) => {
  try {
    const tag = await Tag.findOne({ name: req.params.name });

    if (!tag) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }

    const questions = await Question.find({ tags: tag.name, isActive: true })
      .populate("author", "username avatar reputation")
      .sort("-createdAt");

    res.json({ success: true, data: { tag, questions } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
