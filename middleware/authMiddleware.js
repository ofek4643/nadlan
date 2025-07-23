import jwt from "jsonwebtoken";

// בדיקת יוזר שנוצר מטוקן תקין
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "משתמש לא מחובר" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "טוקן לא תקין" });
  }
};

export default authenticate;
