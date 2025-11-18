import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import QuestionCard from "../components/QuestionCard";
import { TrendingUp, Users, MessageSquare, Award } from "lucide-react";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({ users: 0, questions: 0, answers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get("/api/questions?limit=5");
      setQuestions(data.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-8 text-white mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Campus Connect</h1>
        <p className="text-xl mb-6 text-primary-100">
          A community-driven platform for students to ask questions, share
          knowledge, and learn together.
        </p>
        <div className="flex gap-4">
          <Link
            to="/questions"
            className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
          >
            Browse Questions
          </Link>
          <Link
            to="/ask"
            className="bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition border-2 border-white"
          >
            Ask a Question
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card flex items-center gap-4">
          <div className="bg-primary-100 p-3 rounded-lg">
            <Users className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">2,547</p>
            <p className="text-gray-600">Students</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <MessageSquare className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">8,932</p>
            <p className="text-gray-600">Questions</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Award className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">15,234</p>
            <p className="text-gray-600">Answers</p>
          </div>
        </div>
      </div>

      {/* Recent Questions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            Recent Questions
          </h2>
          <Link
            to="/questions"
            className="text-primary-600 hover:text-primary-800 font-medium"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
