import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Eye, ArrowBigUp, CheckCircle } from "lucide-react";

const QuestionCard = ({ question }) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Stats */}
        <div className="flex flex-col items-center gap-3 text-gray-600 min-w-[80px]">
          <div className="flex items-center gap-1">
            <ArrowBigUp className="h-4 w-4" />
            <span className="font-medium">{question.votes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="font-medium">{question.answers?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span className="text-sm">{question.views}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Link
            to={`/questions/${question._id}`}
            className="text-lg font-semibold text-primary-700 hover:text-primary-900 mb-2 block"
          >
            {question.title}
            {question.acceptedAnswer && (
              <CheckCircle className="inline-block ml-2 h-5 w-5 text-green-500" />
            )}
          </Link>

          <p className="text-gray-600 mb-3 line-clamp-2">
            {question.body.substring(0, 200)}...
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {question.tags?.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <img
                src={question.author?.avatar}
                alt={question.author?.username}
                className="h-6 w-6 rounded-full"
              />
              <Link
                to={`/users/${question.author?._id}`}
                className="text-primary-600 hover:underline font-medium"
              >
                {question.author?.username}
              </Link>
              <span className="text-gray-500">
                {question.author?.reputation} rep
              </span>
            </div>
            <span className="text-gray-500">
              asked{" "}
              {formatDistanceToNow(new Date(question.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
