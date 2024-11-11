const db = require("../db/dbConfig.js");
// const bcrypt = require("bcrypt"); // You can now include bcrypt if you want to hash passwords

exports.checkEmail = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [
      req.params.email,
    ]);
    res.json({ exists: rows.length > 0 });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      message: "Error checking email",
      error: err.message,
      details: err.stack,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      graduation_year,
      degree,
      current_job,
      company,
      industry,
      mentor_status,
    } = req.body;

    if (
      !email ||
      !password ||
      !first_name ||
      !last_name ||
      !graduation_year ||
      !degree ||
      !current_job ||
      !company ||
      !industry
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    // ... (Data Validation)

    const query = `
      INSERT INTO users (
        email,
        password,
        first_name,
        last_name,
        graduation_year,
        degree,
        current_job,
        company,
        industry,
        mentor_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      email,
      password,
      first_name,
      last_name,
      graduation_year,
      degree,
      current_job,
      company,
      industry,
      mentor_status === "yes" ? 1 : 0,
    ];

    const [result] = await db.query(query, values);

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Error during user creation:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({
      message: "Database error",
      error: err.message,
      stack: err.stack,
    });
  }
};
