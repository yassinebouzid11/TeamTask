import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import Modal from "react-modal";
import axios from "axios";
import type { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "@/redux/taskSlice";
import { fetchUsers } from "@/redux/userSlice";

export interface Task {
  _id: string;
  title: string;
  status: string;
  assignedTo: string;
}

export default function ManageTasks() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "update" | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "à faire",
    assignedTo: "",
  });

  const ITEMS_PER_PAGE = 10;

  const dispatch = useDispatch<AppDispatch>();
  const token = JSON.parse(localStorage.getItem("user") || "null").accessToken;
  const role = JSON.parse(localStorage.getItem("user") || "null").role;

  const { users } = useSelector((state: RootState) => state.users);
  const { list } = useSelector((state: RootState) => state.tasks);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredTasks =
    filter === "all"
      ? list
      : list.filter((task: any) => task.status === filter);

  const indexOfLastTask = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstTask = indexOfLastTask - ITEMS_PER_PAGE;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const addTask = () => {
    dispatch(fetchUsers());
    setModalType("add");
    setIsModalOpen(true);
  };
  const editTask = (task: Task) => {
    setSelectedTask(task);
    setModalType("update");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setModalType(null);
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await axios.put(
        `http://localhost:5000/tasks/${taskId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(fetchTasks());
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut", err);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    console.log("wfsfds");
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/tasks/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchTasks());

      setForm({
        title: "",
        description: "",
        status: "à faire",
        assignedTo: "",
      });
    } catch (err) {
      console.error("Error happend in handleAddSubmit : ", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Tasks</h1>

      <div className="mb-4 flex  gap-2 justify-end">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded cursor-pointer bg-gray-300 px-2 py-1"
        >
          <option value="all">Show all</option>
          <option value="à faire">À faire</option>
          <option value="en cours">En cours</option>
          <option value="terminée">Terminée</option>
        </select>
        {role == "manager" && (
          <button
            onClick={addTask}
            className="flex border rounded px-2 py-1 bg-green-400 cursor-pointer"
          >
            <Plus className="w-5 h-6 mr-1 " />
            Add a task
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-muted text-left">
              <th className="p-3">Title</th>
              <th className="p-3">Description</th>
              <th className="p-3">Assigned to</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task: any) => (
              <tr key={task._id} className="border-t">
                <td className="p-3 font-medium">{task.title}</td>
                <td className="p-3 font-medium max-w-50">{task.description}</td>
                <td className="p-3">{task.assignedTo.name}</td>
                <td className="p-3 ">{task.status}</td>
                <td className="p-3 flex ">
                  <button
                    className="cursor-pointer flex border rounded px-2 py-1 bg-yellow-300"
                    onClick={() => editTask(task)}
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Modifier
                  </button>
                </td>
              </tr>
            ))}
            {filteredTasks.length === 0 && (
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
          {Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)}
        </span>
        <button
          className=" border rounded px-2 cursor-pointer text-sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage * ITEMS_PER_PAGE >= filteredTasks.length}
        >
          Suivant
        </button>
      </div>

      <Modal
        isOpen={isModalOpen && modalType === "update"}
        onRequestClose={closeModal}
        contentLabel="update status"
        className="max-w-sm w-full mx-auto mt-40 bg-white rounded-md shadow-lg p-6 focus:outline-none"
      >
        <h2 className="text-lg font-semibold ">Change status</h2>
        {selectedTask && (
          <>
            <select
              value={selectedTask.status}
              onChange={(e) =>
                handleStatusChange(selectedTask._id, e.target.value)
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
            >
              <option value="à faire">À faire</option>
              <option value="en cours">En cours</option>
              <option value="terminée">Terminée</option>
            </select>
            <div className="flex justify-end mt-2">
              <button
                onClick={closeModal}
                className="flex justify-end border bg-gray-200 rounded px-4 py-1 cursor-pointer"
              >
                Done
              </button>
            </div>
          </>
        )}
      </Modal>
      <Modal
        isOpen={isModalOpen && modalType === "add"}
        onRequestClose={closeModal}
        contentLabel="add task"
        className="max-w-sm w-full mx-auto mt-40 bg-white rounded-md shadow-lg p-6 focus:outline-none"
      >
        <h2 className="text-lg text-center font-semibold mb-2">Add new task</h2>

        <form
          onSubmit={handleAddSubmit}
          className="bg-white p-4 rounded w-full max-w-md"
        >
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:green-400 focus:border-green-400"
            required
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-400"
          />
          <select
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-400"
            required
          >
            <option value="">choose a user</option>
            {users.map(
              (u: any) =>
                u.role == "user" && (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                )
            )}
          </select>
          <div className="flex justify-center mt-4 gap-2">
            <button
              type="submit"
              className="flex justify-end border bg-green-400 rounded px-4 py-1 cursor-pointer"
            >
              Add
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="flex justify-end border bg-gray-200 rounded px-4 py-1 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
