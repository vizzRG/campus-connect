import { NavLink } from "react-router-dom";
import { Home, HelpCircle, Tags, Users, TrendingUp } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/questions", icon: HelpCircle, label: "Questions" },
    { to: "/tags", icon: Tags, label: "Tags" },
    { to: "/users", icon: Users, label: "Users" },
  ];

  return (
    <aside className="hidden lg:block w-64">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-primary-50 text-primary-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 card">
        <h3 className="font-semibold mb-3 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
          Featured Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {["javascript", "python", "react", "node.js", "mongodb"].map(
            (tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
