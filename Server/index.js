import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import AuthRoutes from "./routes/AuthRoutes.js";
import contactRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import MessageRoute from "./routes/MessageRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const databaseURL = process.env.DATABASE_URL;

console.log("Database URL:", databaseURL);

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));

app.use(cookieParser());  // for parsing cookies
app.use(express.json());  // for parsing JSON bodies

// Serve static files
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", MessageRoute);

const server = app.listen(port, () => {
  console.log(`Server is Running at PORT ${port}`);
});

setupSocket(server);

mongoose
  .connect(databaseURL)
  .then(() => console.log("DB Connection Successfully"))
  .catch((err) => console.error("DB Connection Error:", err.message));
