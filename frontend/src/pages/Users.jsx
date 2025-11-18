import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, Award } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/users");
      setUsers(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Users</h1>
        <p className="text-gray-600">
          Connect with fellow students and learn from each other
        </p>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <Link
              key={user._id}
              to={`/users/${user._id}`}
              className="card hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-16 w-16 rounded-full group-hover:scale-105 transition-transform"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-primary-700 group-hover:text-primary-900">
                    {user.username}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span>{user.reputation} reputation</span>
                  </div>
                </div>
              </div>
              {user.bio && (
                <p className="text-sm text-gray-600 line-clamp-2">{user.bio}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
