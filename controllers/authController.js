import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullName, userName, email, phoneNumber, password } = req.body;

    const existingUserName = await User.findOne({ userName });
    const existingEmail = await User.findOne({ email });
    const existingPhoneNumber = await User.findOne({ phoneNumber });

    if (existingUserName)
      return res.status(400).json({ error: "שם המשתמש כבר רשום במערכת" });

    if (existingEmail)
      return res.status(400).json({ error: "האימייל כבר רשום במערכת" });

    if (existingPhoneNumber)
      return res.status(400).json({ error: "מספר טלפון כבר רשום במערכת" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      userName,
      email,
      phoneNumber,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role, fullName: newUser.fullName },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(201).json({ message: "משתמש נוצר בהצלחה!" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password, rememberMe } = req.body;
    const user = await User.findOne({ userName });
    if (!user)
      return res.status(401).json({ error: "שם משתמש או סיסמא שגויים" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: "שם משתמש או סיסמא שגויים" });

    if (user.isBlocked) return res.status(401).json({ error: "משתמש חסום" });

    const token = jwt.sign(
      { userId: user._id, role: user.role, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "2h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "התחברת בהצלחה!",
      user: {
        id: user._id,
        fullName: user.fullName,
        userName: user.userName,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("שגיאה בשרת:", error.message);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.status(200).json({ message: "התנתקת בהצלחה" });
};
