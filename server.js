import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import User from "./models/User.js";
import Property from "./models/Property.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

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
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ error: "שם משתמש או סיסמא שגויים" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "שם משתמש או סיסמא שגויים" });
    }

    res.status(200).json("התחברת בהצלחה!");
  } catch (error) {
    console.log("שגיאה בשרת:", error.message);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
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
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
connectDB();
