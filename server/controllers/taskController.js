const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const tasks =
      req.user.role === "manager" ||"admin"
        ? await Task.find().populate("assignedTo", "name email")
        : await Task.find({ assignedTo: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;

    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Accès refusé" });
    }
    const task = await Task.create({
      title,
      description,
      status,
      assignedTo,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    if (
      req.user.role !== "manager" &&
      String(task.assignedTo) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    Object.assign(task, req.body);
    const updated = await task.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Accès refusé" });
    }
    await task.deleteOne();
    res.json({ message: "Tâche supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
