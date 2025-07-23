import User from "../models/User.js";
import bcrypt from "bcrypt";
// שליפת נתונים אישיים
export const getUserInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select(
      "fullName email phoneNumber userName role"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// בדיקת אימות סיסמא
export const verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ valid: false });

    const isMatch = await bcrypt.compare(password, user.password);
    res.json({ valid: isMatch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ valid: false });
  }
};

// עדכון נתונים אישיים
export const updateUserInfo = async (req, res) => {
  try {
    const { fullName, phoneNumber, newPassword, userName } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json("משתמש לא נמצא");

    const phoneNumberExist = await User.findOne({ phoneNumber });
    const userNameExist = await User.findOne({ userName });

    if (userNameExist && userNameExist._id.toString() !== userId) {
      return res.status(400).json({ error: "שם משתמש כבר קיים במערכת" });
    }
    if (phoneNumberExist && phoneNumberExist._id.toString() !== userId) {
      return res.status(400).json({ error: "מספר טלפון כבר קיים במערכת" });
    }

    user.phoneNumber = phoneNumber;
    user.fullName = fullName;
    user.userName = userName;

    if (newPassword && newPassword.trim() !== "") {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json("הנתונים עודכנו בהצלחה");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר",
    });
  }
};
