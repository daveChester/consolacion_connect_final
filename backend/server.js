//backend/server.js
const express = require("express");
const cors = require("cors");
const db = require("./db/dbConfig");
const userController = require("./controllers/userController");
const crudController = require("./controllers/crudController");
const upload = require("./middleware/upload");

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "User-ID"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));

// Unprotected routes
app.post("/api/login", userController.login);
app.post("/api/signup", userController.createUser);
app.get("/api/check-email/:email", userController.checkEmail);
app.post("/api/admin/login", userController.adminLogin);

// Protected routes
app.get("/api/:entity", crudController.handleCrudOperations);
app.post(
  "/api/:entity",
  upload.single("image"),
  crudController.handleCrudOperations
);
app.put(
  "/api/:entity/:id",
  upload.single("image"),
  crudController.handleCrudOperations
);
app.delete("/api/:entity/:id", crudController.handleCrudOperations);

app.use((err, req, res, next) => {
  console.error("Error handler:", err);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
