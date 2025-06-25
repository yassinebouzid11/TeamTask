require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.config");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const app = express();

connectDB();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());

app.use((req, res, next) => {
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.params);
  next();
});                                   //contre injection
app.use(hpp()); // contre les requette pollué qui pet inflige a un DOS


app.use("/auth", require("./routes/authRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));
app.use("/users", require("./routes/userRoutes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
