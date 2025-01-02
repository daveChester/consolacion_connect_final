const db = require("../db/dbConfig");

exports.checkEmail = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT user_id FROM users WHERE email = ?", [
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
    const { email, password, first_name, last_name, batch_year, course } =
      req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const tempStudentId = `TEMP${Date.now()}`;
    const query = `
      INSERT INTO users (
        email, password, first_name, last_name, 
        batch_year, course, student_id, year_level,
        front_id_picture, back_id_picture
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      email,
      password,
      first_name,
      last_name,
      batch_year || null,
      course || null,
      tempStudentId,
      1,
      "pending",
      "pending",
    ];

    await db.query(query, values);
    res.status(201).json({ message: "User  created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User  not found" });
    }

    const user = rows[0];
    delete user.password;
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = { ...req.body };
    delete updateData.password;

    if (req.files) {
      if (req.files.front_id_picture) {
        const frontIdFile = req.files.front_id_picture[0];
        updateData.front_id_picture = frontIdFile.filename;
      }
      if (req.files.back_id_picture) {
        const backIdFile = req.files.back_id_picture[0];
        updateData.back_id_picture = backIdFile.filename;
      }
    }

    const setClause = Object.keys(updateData)
      .map((key) => `${key} = ?`)
      .join(", ");

    const query = `
      UPDATE users 
      SET ${setClause}
      WHERE user_id = ?
    `;

    const values = [...Object.values(updateData), userId];
    await db.query(query, values);

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
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

    const userData = { ...user };
    delete userData.password;

    res.json({
      message: "Login successful",
      user: userData,
      token: "your-token-generation-here", // Add actual token generation
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

exports.adminLogin = async (req, res) => {
  try {
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
      res.json({
        message: "Admin login successful",
        user: adminUser,
        token: "your-admin-token-here", // Add actual token generation
      });
    } else {
      res.status(401).json({ message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Admin login failed" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await db.query("DELETE FROM users WHERE user_id = ?", [userId]);
    res.json({ message: "User  deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    const users = rows.map((user) => {
      const userData = { ...user };
      delete userData.password;
      return userData;
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Database error" });
  }
};
