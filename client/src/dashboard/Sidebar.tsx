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
        <div className={role == "user" ? "bg-green-400 border rounded h-8 px-2": role == "manager" ? "bg-yellow-300 border rounded h-8 px-2 ":"bg-red-400 border rounded h-8 px-2 " }>{role}</div>
      </div>
      <nav className="space-y-2">

          {role !== "admin" && <Link
            key={"/dashboard/tasks"}
            to={"/dashboard/tasks"}
            className={
              location.pathname === "/dashboard/tasks"
                ? "block px-4 py-2 rounded hover:bg-gray-100 transition bg-gray-200 font-semibold"
                : "block px-4 py-2 rounded hover:bg-gray-100 transition"
            }
          >
            Tasks
          </Link>}
          {role == "admin" && <Link
            key={"/dashboard/admin/users"}
            to={"/dashboard/admin/users"}
            className={
              location.pathname === "/dashboard/admin/users"
                ? "block px-4 py-2 rounded hover:bg-gray-100 transition bg-gray-200 font-semibold"
                : "block px-4 py-2 rounded hover:bg-gray-100 transition"
            }
          >
            Users
          </Link>}
          
      </nav>
    </aside>
  );
}
