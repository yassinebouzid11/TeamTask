import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import Modal from "react-modal";
import type { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

import { fetchUsers } from "@/redux/userSlice";

export interface Task {
  _id: string;
  title: string;
  status: string;
  assignedTo: string;
}

export default function ManageUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "update" | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const ITEMS_PER_PAGE = 10;

  const dispatch = useDispatch<AppDispatch>();
  const token = JSON.parse(localStorage.getItem("user") || "null").accessToken;
  const role = JSON.parse(localStorage.getItem("user") || "null").role;

  const { users } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredRole =
    filter === "all"
      ? users
      : users.filter((user: any) => user.role === filter);

  const filteredUsers = filteredRole.filter(
    (user: any) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );
  const indexOfLastTask = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstTask = indexOfLastTask - ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Tasks</h1>
      <div className="mb-4 flex  gap-2 justify-end">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className=" block  px-3 py-2 border border-gray-300 rounded-md shadow-sm "
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded cursor-pointer bg-gray-300 px-2"
        >
          <option value="all">Show all</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-muted text-left">
              <th className="p-3">name</th>
              <th className="p-3">email</th>
              <th className="p-3">role</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user: any) => (
              <tr key={user._id} className="border-t">
                <td className="p-3 font-medium">{user.name}</td>
                <td className="p-3 font-medium max-w-50">{user.email}</td>
                <td className="p-3">{user.role}</td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center p-4 text-muted-foreground"
                >
                  There is no available tasks
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <button
          className=" border rounded px-2 cursor-pointer text-sm"
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <span className="mx-2">
          Page {currentPage} sur{" "}
          {Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)}
        </span>
        <button
          className=" border rounded px-2 cursor-pointer text-sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage * ITEMS_PER_PAGE >= filteredUsers.length}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
