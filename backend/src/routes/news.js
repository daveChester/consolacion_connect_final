const express = require("express");
const router = express.Router();
const db = require("../../db/dbConfig");
const multer = require("multer");
const path = require("path");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, "news-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

// Serve uploaded files statically
router.use("/uploads", express.static("public/uploads"));

// Get all news
router.get("/api/news", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM news ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get single news
router.get("/api/news/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM news WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create news
router.post("/api/news", upload.single("image"), async (req, res) => {
  try {
    const { title, excerpt } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.query(
      "INSERT INTO news (title, excerpt, image) VALUES (?, ?, ?)",
      [title, excerpt, imagePath]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      excerpt,
      image: imagePath,
    });
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update news
router.put("/api/news/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, excerpt } = req.body;
    const newsId = req.params.id;

    let query = "UPDATE news SET title = ?, excerpt = ?";
    let params = [title, excerpt];

    if (req.file) {
      query += ", image = ?";
      params.push(`/uploads/${req.file.filename}`);
    }

    query += " WHERE id = ?";
    params.push(newsId);

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json({ message: "News updated successfully" });
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete news
router.delete("/api/news/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM news WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
