import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../middleware/errorHandler.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
// Route for user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(401, "User does not exist");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = createToken(user._id);
  res.json({ success: true, token });
};

// Route for user register

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // validate everything before touching it - password.length used to throw
  // a TypeError when the field was missing
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Please enter a valid email");
  }
  if (password.length < 8) {
    throw new ApiError(400, "Please enter a strong password");
  }

  // checking user already exists or not
  const exists = await userModel.findOne({ email });
  if (exists) {
    throw new ApiError(409, "User already exists");
  }

  // hashing user password (hash generates its own salt)
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({
    name,
    email,
    password: hashedPassword,
  });

  const user = await newUser.save();
  const token = createToken(user._id);
  res.status(201).json({ success: true, token });
};

// Route for admin login

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Sign a role claim - the old token embedded the admin password in the
  // payload, which is only base64 encoded and readable by anyone.
  const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ success: true, token });
};

export { loginUser, registerUser, adminLogin };
