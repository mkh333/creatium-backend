import express from "express";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import mongoose from "mongoose";
import fs from "fs";
import cors from "cors";

import { getPortfolio, create, update } from "./controllers/PortfolioController.js";
import { signIn, signUp } from "./controllers/userController.js";
import { signUpValidator, signInValidator, portfolioValidation } from "./validation/auth.js";
import middleware from "./middleware.js";
import handleValidation from "./validation/handleValidation.js";

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// App
const app = express();
const PORT = process.env.PORT || 3100;

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      "http://localhost:3000",
      "http://localhost:5173",
    ];
    if (!origin || allowed.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static("uploads"));

// Multer
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads"),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`),
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Invalid file type"), false);
  },
});

// Auth
app.post("/sign-up", signUpValidator, handleValidation, signUp);
app.post("/sign-in", signInValidator, handleValidation, signIn);

// Portfolio
app.get("/portfolio", middleware, getPortfolio);
app.post("/portfolio", middleware, portfolioValidation, handleValidation, create);
app.patch("/portfolio/:id", middleware, portfolioValidation, handleValidation, update);

// Upload
app.post("/upload", middleware, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "File not uploaded" });
  res.json({ url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
