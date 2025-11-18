import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { HelpCircle, Tag, FileText } from "lucide-react";

const AskQuestion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    tags: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.title.length < 15) {
      toast.error("Title must be at least 15 characters");
      return;
    }

    if (formData.body.length < 30) {
      toast.error("Question body must be at least 30 characters");
      return;
    }

    try {
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean);

      const { data } = await axios.post("/api/questions", {
        title: formData.title,
        body: formData.body,
        tags,
      });

      toast.success("Question posted successfully!");
      navigate(`/questions/${data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post question");
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ask a Question</h1>
        <p className="text-gray-600">
          Get help from the Campus Connect community. Be specific and clear in
          your question.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="card">
          <label className=" mb-2 font-semibold flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary-600" />
            Title
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Be specific and imagine you're asking a question to another person.
          </p>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g., How do I implement user authentication in React?"
            className="input-field"
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            {formData.title.length}/150 characters (minimum 15)
          </p>
        </div>

        {/* Body */}
        <div className="card">
          <label className=" mb-2 font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-600" />
            Question Details
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Include all the information someone would need to answer your
            question. Markdown is supported.
          </p>
          <textarea
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            placeholder="Describe your question in detail...

## What I've tried
- Attempted solution 1
- Attempted solution 2

## Expected behavior
Describe what you expected to happen

## Actual behavior
Describe what actually happened"
            className="input-field min-h-[300px] font-mono text-sm"
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            {formData.body.length} characters (minimum 30)
          </p>
        </div>

        {/* Tags */}
        <div className="card">
          <label className=" mb-2 font-semibold flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary-600" />
            Tags
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Add up to 5 tags to describe what your question is about. Separate
            tags with commas.
          </p>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g., javascript, react, authentication"
            className="input-field"
            required
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.tags
              .split(",")
              .filter(Boolean)
              .map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                >
                  {tag.trim()}
                </span>
              ))}
          </div>
        </div>

        {/* Guidelines */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-2">Writing a good question</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Make sure your question hasn't been asked before</li>
            <li>• Use a clear, descriptive title</li>
            <li>• Provide context and relevant code examples</li>
            <li>• Include what you've tried and what didn't work</li>
            <li>• Use proper formatting and grammar</li>
          </ul>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button type="submit" className="btn-primary">
            Post Your Question
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AskQuestion;
