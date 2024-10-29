const express = require("express");
const cors = require("cors");
const db = require("./db/dbConfig");
const userController = require("./controllers/userController.js");
const jwt = require("jsonwebtoken"); // Make sure jsonwebtoken is installed

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"], // Add your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Request body:", req.body);
  next();
});

// User routes
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.params.id,
    ]);
    if (!rows.length)
      return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error in GET /api/users/:id:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/signup", userController.createUser);

app.get("/api/check-email/:email", userController.checkEmail);

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check if the user exists
    const [userRows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = userRows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare the entered password with the stored password in the database
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT (Replace 'your-jwt-secret' with your actual secret)
    const token = jwt.sign({ userId: user.id }, "your-jwt-secret");

    // Send successful response
    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/login:", error);
    res.status(500).json({ message: error.message });
  }
});

// Task routes
// ... (Your Task routes here) ...

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for origins: ${corsOptions.origin}`);
});
