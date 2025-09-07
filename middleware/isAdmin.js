// בדיקת מנהל
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "הבקשה נדחתה" });
  }
  next();
};

export default isAdmin;
