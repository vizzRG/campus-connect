import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import QuestionCard from "../components/QuestionCard";
import { Filter } from "lucide-react";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("-createdAt");

  useEffect(() => {
    fetchQuestions();
  }, [sortBy]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/questions?sort=${sortBy}`);
      setQuestions(data.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Questions</h1>
        <Link to="/ask" className="btn-primary">
          Ask Question
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6 flex items-center justify-between">
        <p className="text-gray-600">{questions.length} questions</p>
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-auto"
          >
            <option value="-createdAt">Newest</option>
            <option value="-votes">Most Voted</option>
            <option value="-views">Most Viewed</option>
            <option value="createdAt">Oldest</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No questions yet</p>
          <Link to="/ask" className="btn-primary">
            Be the first to ask!
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Questions;
