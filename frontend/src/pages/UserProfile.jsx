import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import {
  Award,
  MapPin,
  Globe,
  Github,
  Twitter,
  Calendar,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

const UserProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("questions");

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`/api/users/${id}`);
      setProfile(data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) return <div>User not found</div>;

  return (
    <div>
      {/* Profile Header */}
      <div className="card mb-6">
        <div className="flex items-start gap-6">
          <img
            src={profile.user.avatar}
            alt={profile.user.username}
            className="h-32 w-32 rounded-full"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{profile.user.username}</h1>

            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">{profile.user.reputation}</span>
                <span>reputation</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Joined{" "}
                  {formatDistanceToNow(new Date(profile.user.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            {profile.user.bio && (
              <p className="text-gray-700 mb-4">{profile.user.bio}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm">
              {profile.user.location && (
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.user.location}</span>
                </div>
              )}
              {profile.user.website && (
                <a
                  href={profile.user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary-600 hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  <span>Website</span>
                </a>
              )}
              {profile.user.github && (
                <a
                  href={`https://github.com/${profile.user.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-gray-700 hover:underline"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              )}
              {profile.user.twitter && (
                <a
                  href={`https://twitter.com/${profile.user.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-500 hover:underline"
                >
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 p-3 rounded-lg">
              <HelpCircle className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {profile.stats.questionsCount}
              </p>
              <p className="text-gray-600">Questions</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{profile.stats.answersCount}</p>
              <p className="text-gray-600">Answers</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {profile.user.badges?.length || 0}
              </p>
              <p className="text-gray-600">Badges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card mb-6">
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === "questions"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Questions ({profile.stats.questionsCount})
          </button>
          <button
            onClick={() => setActiveTab("answers")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === "answers"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Answers ({profile.stats.answersCount})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "questions" && (
          <>
            {profile.questions.length === 0 ? (
              <div className="card text-center py-12 text-gray-500">
                No questions yet
              </div>
            ) : (
              profile.questions.map((question) => (
                <div key={question._id} className="card">
                  <Link
                    to={`/questions/${question._id}`}
                    className="text-lg font-semibold text-primary-700 hover:text-primary-900 mb-2 block"
                  >
                    {question.title}
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{question.votes} votes</span>
                    <span>{question.answers?.length || 0} answers</span>
                    <span>{question.views} views</span>
                    <span>
                      {formatDistanceToNow(new Date(question.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "answers" && (
          <>
            {profile.answers.length === 0 ? (
              <div className="card text-center py-12 text-gray-500">
                No answers yet
              </div>
            ) : (
              profile.answers.map((answer) => (
                <div key={answer._id} className="card">
                  <Link
                    to={`/questions/${answer.question._id}`}
                    className="text-lg font-semibold text-primary-700 hover:text-primary-900 mb-2 block"
                  >
                    {answer.question.title}
                  </Link>
                  <p className="text-gray-700 mb-3 line-clamp-2">
                    {answer.body.substring(0, 200)}...
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{answer.votes} votes</span>
                    {answer.isAccepted && (
                      <span className="text-green-600 font-medium">
                        ✓ Accepted
                      </span>
                    )}
                    <span>
                      {formatDistanceToNow(new Date(answer.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
