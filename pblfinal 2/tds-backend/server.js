const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./models/User");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// API Test route
app.get("/api/test", (req, res) => {
  res.send("TDS Backend Running 🚀");
});

// Signup API
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, role, createdBy } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      name: name || "User", 
      email, 
      password: hashedPassword, 
      role: role || "EMPLOYEE",
      createdBy: createdBy || "System"
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully ✅", user: { id: newUser._id, email: newUser.email } });
  } catch (error) { res.status(500).json({ message: "Server error" }); }
});

// Login API
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });
    res.status(200).json({ message: "Login successful ✅", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { res.status(500).json({ message: "Server error" }); }
});

// Users API
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users.map(u => ({ ...u.toObject(), id: u._id })));
  } catch (error) { res.status(500).json({ message: "Server error" }); }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) { res.status(500).json({ message: "Server error" }); }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };
    // Hash password if it's being updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
    res.json({ ...updatedUser.toObject(), id: updatedUser._id });
  } catch (error) { res.status(500).json({ message: "Server error" }); }
});

// Stats API
app.get("/api/stats", async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: "EMPLOYEE" });
    const totalHRs = await User.countDocuments({ role: "HR" });
    const totalAdmins = await User.countDocuments({ role: "ADMIN" });
    res.json({ totalEmployees, totalHRs, totalAdmins });
  } catch (error) { res.status(500).json({ message: "Server error" }); }
});

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Catch-all route for any non-API routes to serve index.html (useful for SPA)
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// MongoDB connection and Start server
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5001;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
    app.listen(PORT, () => {
      console.log(`\n🚀 TDS Portal is running!`);
      console.log(`🔗 Local link: http://localhost:${PORT}\n`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed ❌", err);
  });
