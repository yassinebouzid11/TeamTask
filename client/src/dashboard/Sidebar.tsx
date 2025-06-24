import { Link, useLocation } from "react-router-dom";

const navLinks = [
  // { label: "Dashboard", path: "/admin" },
  { label: "Tasks", path: "/dashboard/tasks" },
];

export default function Sidebar() {
  const location = useLocation();
  const role = JSON.parse(localStorage.getItem("user") || "null").role;

  return (
    <aside className="w-64 min-h-screen border-r bg-white shadow-md p-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <div className={role == "user" ? "bg-green-400 border rounded h-8 px-2":"bg-yellow-300 border rounded h-8 px-2 "}>{role}</div>
      </div>
      <nav className="space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={
              location.pathname === link.path
                ? "block px-4 py-2 rounded hover:bg-gray-100 transition bg-gray-200 font-semibold"
                : "block px-4 py-2 rounded hover:bg-gray-100 transition"
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
