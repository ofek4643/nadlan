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
const allowedOrigins = [
  "http://localhost:5173",
  "https://nadlan-react1.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `ה-CORS policy לא מאפשר גישה מ-origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

const port = process.env.PORT || 3000;

// חיבור המסד נתונים
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
// הרשמה
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

// התחברות
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

// התנתקות

app.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  res.status(200).json({ message: "התנתקת בהצלחה" });
});

// הוספת נכס
app.post("/add-property", authenticate, async (req, res) => {
  try {
    const {
      header,
      description,
      price,
      status,
      type,
      city,
      neighborhood,
      street,
      houseNumber,
      floor,
      maxFloor,
      imageUrl,
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
      street,
      houseNumber,
      floor,
      maxFloor,
      imageUrl,
      size,
      rooms,
      bathrooms,
      furnished,
      airConditioning,
      parking,
      balcony,
      elevator,
      storage,
      userId: req.user.userId,
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
// מציאת מידע על הנכס
app.get("/propertyId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "נכס לא נמצא" });
    }
    return res.json(property);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר",
    });
  }
});
// הוצאת כל הנכסים באתר
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
// שליפת נתונים אישיים
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

// בדיקת אימות סיסמא
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
// עדכון נתונים אישיים
app.put("/users/update-information", authenticate, async (req, res) => {
  try {
    const { fullName, phoneNumber, newPassword, userName } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const phoneNumberExist = await User.findOne({ phoneNumber });
    const userNameExist = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json("משתמש לא נמצא");
    }
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
    return res.status(500).json({
      error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר",
    });
  }
});
// שליפת נכסים שלי
app.get("/my-properties", authenticate, async (req, res) => {
  try {
    const properties = await Property.find({ userId: req.user.userId });
    res.json(properties);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר",
    });
  }
});
// הוספת למעודפים
app.post("/add-favorite", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    const { propertyId } = req.body;
    if (!user) return res.status(404).json({ error: "משתמש לא נמצא" });

    const index = user.favoriteProperties.indexOf(propertyId);
    if (index > -1) {
      user.favoriteProperties.splice(index, 1);
    } else {
      user.favoriteProperties.push(propertyId);
    }

    await user.save();

    res.json(user.favoriteProperties);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר",
    });
  }
});
// שליפת נכסים מעודפים
app.get("/add-favorite", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate(
      "favoriteProperties"
    );
    if (!user) return res.status(404).json({ error: "משתמש לא נמצא" });
    const myFavoriteProperties = user.favoriteProperties;
    res.json(myFavoriteProperties);
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר",
    });
  }
});

// יצירת השרת
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
connectDB();
