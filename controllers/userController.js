import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/user.js";

const createToken = (id) =>
  jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const sanitizeUser = ({ password, ...rest }) => rest;

export const signUp = async (req, res) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = await UserModel.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: passwordHash,
    });
    res.json({ ...sanitizeUser(user._doc), token: createToken(user._id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register" });
  }
};

export const signIn = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) return res.status(400).json({ message: "Invalid password" });

    res.json({ ...sanitizeUser(user._doc), token: createToken(user._id) });
  } catch {
    res.status(500).json({ message: "Failed to sign in" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(sanitizeUser(user._doc));
  } catch {
    res.status(500).json({ message: "Failed to get user" });
  }
};
