const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  // Skip authentication for OPTIONS requests (used in CORS preflight)
  if (req.method === "OPTIONS") {
    return next();
  }

  // Check for authorization header
  const authHeader = req.headers.authorization;

  // If no authorization header is present, return unauthorized
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized: No token provided",
      error: "Missing or invalid authorization header",
    });
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || process.env.JWT_FALLBACK_SECRET
    );

    // Attach the decoded user information to the request
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Log the specific error for server-side debugging
    console.error("Token verification error:", {
      name: err.name,
      message: err.message,
    });

    // Handle different types of JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Unauthorized: Token expired",
        error: "Token has expired",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Unauthorized: Invalid token",
        error: "Token is malformed or invalid",
      });
    }

    // Catch-all for other potential errors
    return res.status(401).json({
      message: "Unauthorized",
      error: "Authentication failed",
    });
  }
};

module.exports = authenticate;
