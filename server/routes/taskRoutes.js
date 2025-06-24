const expressTask = require("express");
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");
const { verifyJWT } = require("../middlewares/verifyJWT");
const router = expressTask.Router();


router.use(verifyJWT)
router.route("/").get(getTasks);
router.route("/").post(createTask);
router.route("/:id").put(updateTask);
router.route("/:id").delete(deleteTask);

module.exports = router;