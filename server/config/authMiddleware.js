import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  const token = req.cookies.token;

  console.log("cookie: " + token);
  
  if (!token) return res.status(401).json({success:false, message: "Not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
