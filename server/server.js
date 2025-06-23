require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.config");
const cors = require("cors");

const app = express();

connectDB();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
