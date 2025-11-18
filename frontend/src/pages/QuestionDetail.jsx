import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Eye,
  CheckCircle,
  Trash2,
  Edit,
} from "lucide-react";

const QuestionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const { data } = await axios.get(`/api/questions/${id}`);
      setQuestion(data.data);
    } catch (error) {
      toast.error("Question not found");
      navigate("/questions");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (type, targetId, isAnswer = false) => {
    if (!user) {
      toast.error("Please login to vote");
      return;
    }

    try {
      const endpoint = isAnswer
        ? `/api/answers/${targetId}/vote`
        : `/api/questions/${targetId}/vote`;
      await axios.post(endpoint, { vote: type });
      fetchQuestion();
    } catch (error) {
      toast.error(error.response?.data?.message || "Vote failed");
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to answer");
      return;
    }

    if (answer.length < 30) {
      toast.error("Answer must be at least 30 characters");
      return;
    }

    try {
      await axios.post("/api/answers", {
        body: answer,
        questionId: id,
      });
      toast.success("Answer posted!");
      setAnswer("");
      fetchQuestion();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post answer");
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    try {
      await axios.post(`/api/answers/${answerId}/accept`);
      toast.success("Answer accepted!");
      fetchQuestion();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept answer");
    }
  };

  const handleAddComment = async (e, targetId, isAnswer = false) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    try {
      const endpoint = isAnswer
        ? `/api/answers/${targetId}/comments`
        : `/api/questions/${targetId}/comments`;
      await axios.post(endpoint, { text: comment });
      toast.success("Comment added!");
      setComment("");
      fetchQuestion();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!question) return null;

  const isAuthor = user?._id === question.author?._id;

  return (
    <div className="max-w-4xl">
      {/* Question */}
      <div className="card mb-6">
        <h1 className="text-3xl font-bold mb-4">{question.title}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {question.views} views
          </span>
          <span>
            Asked{" "}
            {formatDistanceToNow(new Date(question.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        <div className="flex gap-4">
          {/* Voting */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleVote("up", question._id)}
              className={`p-2 rounded-lg transition ${
                question.upvotedBy?.includes(user?._id)
                  ? "bg-primary-100 text-primary-700"
                  : "hover:bg-gray-100"
              }`}
              disabled={!user}
            >
              <ArrowBigUp className="h-8 w-8" />
            </button>
            <span className="text-2xl font-bold">{question.votes}</span>
            <button
              onClick={() => handleVote("down", question._id)}
              className={`p-2 rounded-lg transition ${
                question.downvotedBy?.includes(user?._id)
                  ? "bg-red-100 text-red-700"
                  : "hover:bg-gray-100"
              }`}
              disabled={!user}
            >
              <ArrowBigDown className="h-8 w-8" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="prose max-w-none mb-6 markdown-body">
              <ReactMarkdown>{question.body}</ReactMarkdown>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags?.map((tag) => (
                <Link
                  key={tag}
                  to={`/questions?tag=${tag}`}
                  className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-100"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Author */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 bg-primary-50 p-4 rounded-lg">
                <img
                  src={question.author?.avatar}
                  alt={question.author?.username}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <Link
                    to={`/users/${question.author?._id}`}
                    className="font-semibold text-primary-700 hover:underline"
                  >
                    {question.author?.username}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {question.author?.reputation} reputation
                  </p>
                </div>
              </div>

              {isAuthor && (
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Comments */}
            {question.comments?.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h4 className="font-semibold mb-3">Comments</h4>
                <div className="space-y-3">
                  {question.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3 text-sm">
                      <img
                        src={comment.user?.avatar}
                        alt={comment.user?.username}
                        className="h-6 w-6 rounded-full"
                      />
                      <div>
                        <span className="font-medium">
                          {comment.user?.username}
                        </span>
                        <span className="text-gray-600 ml-2">
                          {comment.text}
                        </span>
                        <span className="text-gray-400 ml-2">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Comment */}
            {user && (
              <form
                onSubmit={(e) => handleAddComment(e, question._id)}
                className="mt-4"
              >
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="input-field text-sm"
                />
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          {question.answers?.length || 0} Answers
        </h2>

        <div className="space-y-6">
          {question.answers?.map((ans) => (
            <div key={ans._id} className="card">
              <div className="flex gap-4">
                {/* Voting */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => handleVote("up", ans._id, true)}
                    className={`p-2 rounded-lg transition ${
                      ans.upvotedBy?.includes(user?._id)
                        ? "bg-primary-100 text-primary-700"
                        : "hover:bg-gray-100"
                    }`}
                    disabled={!user}
                  >
                    <ArrowBigUp className="h-6 w-6" />
                  </button>
                  <span className="text-xl font-bold">{ans.votes}</span>
                  <button
                    onClick={() => handleVote("down", ans._id, true)}
                    className={`p-2 rounded-lg transition ${
                      ans.downvotedBy?.includes(user?._id)
                        ? "bg-red-100 text-red-700"
                        : "hover:bg-gray-100"
                    }`}
                    disabled={!user}
                  >
                    <ArrowBigDown className="h-6 w-6" />
                  </button>

                  {isAuthor && !ans.isAccepted && (
                    <button
                      onClick={() => handleAcceptAnswer(ans._id)}
                      className="p-2 hover:bg-green-50 rounded-lg transition"
                      title="Accept this answer"
                    >
                      <CheckCircle className="h-6 w-6 text-gray-400 hover:text-green-600" />
                    </button>
                  )}

                  {ans.isAccepted && (
                    <div className="p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="prose max-w-none mb-4 markdown-body">
                    <ReactMarkdown>{ans.body}</ReactMarkdown>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <img
                      src={ans.author?.avatar}
                      alt={ans.author?.username}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <Link
                        to={`/users/${ans.author?._id}`}
                        className="font-semibold text-primary-700 hover:underline"
                      >
                        {ans.author?.username}
                      </Link>
                      <p className="text-sm text-gray-600">
                        answered{" "}
                        {formatDistanceToNow(new Date(ans.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Comments */}
                  {ans.comments?.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <div className="space-y-3">
                        {ans.comments.map((comment) => (
                          <div key={comment._id} className="flex gap-3 text-sm">
                            <img
                              src={comment.user?.avatar}
                              alt={comment.user?.username}
                              className="h-6 w-6 rounded-full"
                            />
                            <div>
                              <span className="font-medium">
                                {comment.user?.username}
                              </span>
                              <span className="text-gray-600 ml-2">
                                {comment.text}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Form */}
      {user ? (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Your Answer</h3>
          <form onSubmit={handleSubmitAnswer}>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write your answer here... (Markdown supported)"
              className="input-field min-h-[200px] font-mono text-sm"
              required
            />
            <p className="text-sm text-gray-500 mt-2 mb-4">
              Minimum 30 characters. Use Markdown for formatting.
            </p>
            <button type="submit" className="btn-primary">
              Post Your Answer
            </button>
          </form>
        </div>
      ) : (
        <div className="card text-center">
          <p className="text-gray-600 mb-4">Please login to post an answer</p>
          <Link to="/login" className="btn-primary inline-block">
            Log in
          </Link>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;
