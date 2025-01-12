const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const db = require("./db/dbConfig");
const userController = require("./controllers/userController");
const crudController = require("./controllers/crudController");

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "User-ID"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.post("/api/login", userController.login);
app.post("/api/signup", userController.createUser);
app.get("/api/check-email/:email", userController.checkEmail);
app.post("/api/admin/login", userController.adminLogin);

app.get("/api/users/:id", userController.getUser);
app.put(
  "/api/users/:id",
  upload.fields([
    { name: "profile_picture", maxCount: 1 },
    { name: "front_id_picture", maxCount: 1 },
    { name: "back_id_picture", maxCount: 1 },
  ]),
  userController.updateUser
);
app.get("/api/users", userController.getAllUsers);
app.get("/api/alumni_directory", userController.getAllUsers);
app.get("/api/alumni_directory/unverified", userController.getUnverifiedUsers);
app.put("/api/alumni_directory/:id/verify", userController.verifyUser);
app.delete("/api/users/:id", userController.deleteUser);

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
  console.error("Error:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: "File upload error",
      error: err.message,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation error",
      error: err.message,
    });
  }

  res.status(err.status || 500).json({
    message: "Server error",
    error:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message,
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
