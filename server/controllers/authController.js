const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, role, password } = req.body;

  try {
    const duplicatedEmail = await User.findOne({ email }).exec();

    if (duplicatedEmail) {
      return res.status(409).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundedUser = await User.findOne({ email }).exec();

  if (!foundedUser) {
    return res.status(401).json({ message: "User does not exist" });
  }

  const isMatch = await bcrypt.compare(password, foundedUser.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Wrong password" });
  }

  const accessToken = jwt.sign(
    {
      userInfo: {
        id: foundedUser._id,
        email: foundedUser.email,
        name: foundedUser.name,
        role: foundedUser.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).send({
    accessToken,
    id: foundedUser._id,
    email: foundedUser.email,
    name: foundedUser.name,
    role: foundedUser.role,
  });
};

module.exports = {
  register,
  login,
};
