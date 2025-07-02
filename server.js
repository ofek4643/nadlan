import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import User from "./models/User.js";
import Property from "./models/Property.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const port = process.env.PORT || 3000;

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
app.post("/register", async (req, res) => {
  try {
    const { fullName, userName, email, phoneNumber, password } = req.body;

    const existingUserName = await User.findOne({ userName });
    const existingEmail = await User.findOne({ email });
    const existingPhoneNumber = await User.findOne({ phoneNumber });

    if (existingUserName) {
      return res.status(400).json({ error: "שם המשתמש כבר רשום במערכת" });
    }

    if (existingEmail) {
      return res.status(400).json({ error: "האימייל כבר רשום במערכת" });
    }

    if (existingPhoneNumber) {
      return res.status(400).json({ error: "מספר טלפון כבר רשום במערכת" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName: fullName,
      userName: userName,
      email: email,
      phoneNumber: phoneNumber,
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
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(201).json({ message: "משתמש נוצר בהצלחה!" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { userName, password, rememberMe } = req.body;

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ error: "שם משתמש או סיסמא שגויים" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "שם משתמש או סיסמא שגויים" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "2h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
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
});

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "לא מחובר" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "טוקן לא תקין" });
  }
};

app.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  res.status(200).json({ message: "התנתקת בהצלחה" });
});

app.post("/add-property", async (req, res) => {
  try {
    const {
      header,
      description,
      price,
      status,
      type,
      city,
      neighborhood,
      houseNumber,
      floor,
      maxFloor,
      size,
      rooms,
      bathrooms,
      furnished,
      airConditioning,
      parking,
      balcony,
      elevator,
      storage,
    } = req.body;
    const newProperty = new Property({
      header,
      description,
      price,
      status,
      type,
      city,
      neighborhood,
      houseNumber,
      floor,
      maxFloor,
      size,
      rooms,
      bathrooms,
      furnished,
      airConditioning,
      parking,
      balcony,
      elevator,
      storage,
    });
    await newProperty.save();
    return res.status(201).json("הנכס נוסף בהצלחה!");
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר",
    });
  }
});

app.get("/properties", async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error", details: error.message });
  }
});

app.get("/users", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select(
      "fullName email phoneNumber userName"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/users/verify-password", authenticate, async (req, res) => {
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
});
app.put("/users/update-information", authenticate, async (req, res) => {
  try {
    const { fullName, phoneNumber, newPassword } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json("משתמש לא נמצא");
    }
    user.phoneNumber = phoneNumber;
    user.fullName = fullName;
    
    if (newPassword && newPassword.trim() !== "") {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }
    await user.save();
    res.status(200).json("הנתונים עודכנו בהצלחה");
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר",
    });
  }
});
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
connectDB();
