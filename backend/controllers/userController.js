//userController.js
const db = require("../db/dbConfig");
const upload = require("../middleware/upload");

exports.createUser = async (req, res) => {
  try {
    const uploadMiddleware = upload.fields([
      { name: "profile_picture", maxCount: 1 },
      { name: "front_id_picture", maxCount: 1 },
      { name: "back_id_picture", maxCount: 1 },
    ]);

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const { email, password, first_name, last_name, batch_year, course } =
        req.body;

      const profilePicture =
        req.files && req.files["profile_picture"]
          ? req.files["profile_picture"][0]
          : null;
      const frontIdFile =
        req.files && req.files["front_id_picture"]
          ? req.files["front_id_picture"][0]
          : null;
      const backIdFile =
        req.files && req.files["back_id_picture"]
          ? req.files["back_id_picture"][0]
          : null;

      const tempStudentId = `TEMP${Date.now()}`;

      const query = `
        INSERT INTO users (email, password, first_name, last_name, batch_year, course, student_id, profile_picture, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        email,
        password,
        first_name,
        last_name,
        batch_year || null,
        course || null,
        tempStudentId,
        profilePicture ? profilePicture.filename : null,
        frontIdFile && backIdFile ? "verified" : "unverified",
      ];

      await db.query(query, values);
      res.status(201).json({ message: "User created successfully" });
    });
  } catch (error) {
    console.error("Error creating user:", error);
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

exports.getUnverifiedUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE status = 'unverified'"
    );
    const users = rows.map((user) => {
      const userData = { ...user };
      delete userData.password;
      return userData;
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching unverified users:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const query =
      "UPDATE users SET verification_status = 'verified' WHERE user_id = ?";
    await db.query(query, [userId]);

    const [updatedUser] = await db.query(
      "SELECT * FROM users WHERE user_id = ?",
      [userId]
    );

    if (!updatedUser || updatedUser.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found after verification" });
    }

    res.json({
      message: "User verified successfully",
      user: updatedUser[0],
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    res
      .status(500)
      .json({ message: "Failed to verify user", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updateData = { ...req.body };
    delete updateData.verification_status;

    Object.keys(updateData).forEach((key) => {
      if (
        updateData[key] === "" ||
        updateData[key] === undefined ||
        updateData[key] === null
      ) {
        delete updateData[key];
      }
    });

    if (req.files) {
      if (req.files && req.files.profile_picture) {
        updateData.profile_picture = req.files.profile_picture[0].filename;
      }
      if (req.files.front_id_picture && req.files.front_id_picture[0]) {
        updateData.front_id_picture = req.files.front_id_picture[0].filename;
      }
      if (req.files.back_id_picture && req.files.back_id_picture[0]) {
        updateData.back_id_picture = req.files.back_id_picture[0].filename;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid data provided for update" });
    }

    const setClause = Object.keys(updateData)
      .map((key) => `${key} = ?`)
      .join(", ");
    const query = `UPDATE users SET ${setClause} WHERE user_id = ?`;
    const values = [...Object.values(updateData), userId];

    await db.query(query, values);

    const [updatedUser] = await db.query(
      "SELECT * FROM users WHERE user_id = ?",
      [userId]
    );

    if (!updatedUser || updatedUser.length === 0) {
      return res.status(404).json({ message: "User not found after update" });
    }

    const userData = { ...updatedUser[0] };
    delete userData.password;

    res.json({
      message: "Profile updated successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = rows[0];
    delete user.password;
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await db.query("DELETE FROM users WHERE user_id = ?", [userId]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
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
      });
    } else {
      res.status(401).json({ message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Admin login failed" });
  }
};

exports.checkEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const [rows] = await db.query(
      "SELECT COUNT(*) as count FROM users WHERE email = ?",
      [email]
    );
    res.json({ exists: rows[0].count > 0 });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ message: "Database error" });
  }
};
