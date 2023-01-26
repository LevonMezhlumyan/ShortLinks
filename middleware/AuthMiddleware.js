import jwt from "jsonwebtoken";
import config from "config";

export default function useAuth(req, res, next) {
  if (req.method === "OPTIONS") next();
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "User is not authorized" });
    }
    const decoded = jwt.verify(token, process.env.JWTSECRETKEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "User is not authorized" });
  }
}
