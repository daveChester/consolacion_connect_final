const jwt = require("jsonwebtoken");

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email.trim() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { isAdmin: true, email: ADMIN_EMAIL },
      process.env.JWT_SECRET || "your-jwt-secret",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Admin login successful",
      token,
      user: {
        email: ADMIN_EMAIL,
        isAdmin: true,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
