const db = require("../db/dbConfig");

exports.checkEmail = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [
      req.params.email,
    ]);
    res.json({ exists: rows.length > 0 });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ message: "Database error" });
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

    if (!email || !password || !first_name || !last_name) {
      return res
        .status(400)
        .json({
          message: "Email, password, first name, and last name are required.",
        });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const query = `INSERT INTO users (email, password, first_name, last_name, graduation_year, degree, current_job, company, industry, mentor_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
    await db.query(query, values);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = rows[0];

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

exports.adminLogin = (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const adminUser = {
      id: "admin",
      email: ADMIN_EMAIL,
      first_name: "Admin",
      isAdmin: true,
    };
    res.json({ message: "Admin login successful", user: adminUser });
  } else {
    res.status(401).json({ message: "Invalid admin credentials" });
  }
};
