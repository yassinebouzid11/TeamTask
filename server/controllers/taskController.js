const Task = require("../models/Task");
const User = require("../models/User");
const nodemailer = require('nodemailer'); 

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
  const emailBody= "you have got a new task, check your account in TeamTask for details please";
  const emailSubject= "assignement";
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

    sendEmail(assignedTo,emailBody,emailSubject)
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

const sendEmail = async (userId, emailBody, emailSubject) => {
    try {
    
        const user = await User.findById(userId).select('email').lean();
        if (!user || !user.email) {
            throw new Error("User email not found");
        }

    
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'bouzidyassine08@gmail.com',
                pass: 'ahsj mikl mhhh xkhd', 
            },
        });

    
        const mailOptions = {
            from: 'bouzidyassine08@gmail.com', 
            to: user.email, 
            subject: emailSubject,
            text: emailBody,
        };

        await transporter.sendMail(mailOptions);
        console.log('email sent to:', user.email);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
