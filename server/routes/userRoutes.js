const express = require("express");
const { getAllUsers} = require("../controllers/userController");
const { verifyJWT } = require("../middlewares/verifyJWT");
const router = express.Router();


router.use(verifyJWT)
router.route("/").get(getAllUsers);

module.exports = router;