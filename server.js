import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import User from "./models/User.js";
import Property from "./models/Property.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

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

// חיבור המסד נתונים
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
// הגבלת בקשות לשרת מאותו המשתמש

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "שלחת יותר מידי בקשות אנא תמתין כמה דקות",
});

app.use(globalLimiter);

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

    if (user.isBlocked) {
      return res.status(401).json({ error: "משתמש חסום" });
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

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
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
app.put("/edit-property/:id", authenticate, async (req, res) => {
  try {
    const propertyId = req.params.id;
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
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      {
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
      },
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ error: "הנכס לא נמצא" });
    }

    return res.status(200).json("הנכס עודכן בהצלחה!");
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
// הוצאת את נכסים עמוד מסוים + ממיין בלי סינון
app.get("/properties", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const sort = req.query.sort || "";

    const skip = (page - 1) * limit;

    // בניית אפשרות מיון
    let sortOption = {};
    switch (sort) {
      case "מחיר(מהנמוך לגבוה)":
        sortOption = { price: 1 };
        break;
      case "מחיר(מהגבוה לנמוך)":
        sortOption = { price: -1 };
        break;
      case "שטח(מהנמוך לגבוה)":
        sortOption = { size: 1 };
        break;
      case "שטח(מהגבוה לנמוך)":
        sortOption = { size: -1 };
        break;
      case "הכי חדש":
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = {};
    }

    const total = await Property.countDocuments();

    const properties = await Property.find()
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      properties,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("שגיאה בשליפת נכסים", error.message);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});
// מטפלת בסינון ומיון ביחד
app.post("/properties/filter", async (req, res) => {
  try {
    const {
      type,
      city,
      minRooms,
      maxRooms,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      status,
      furnished,
      airConditioning,
      parking,
      balcony,
      elevator,
      storage,
      sort,
      page = 1,
      limit = 9,
    } = req.body;

    const filter = {};

    if (type && type !== "") {
      filter.type = type;
    }
    if (city && city !== "") {
      filter.city = city;
    }
    if (minRooms != null || maxRooms != null) {
      filter.rooms = {};
      if (minRooms != null) filter.rooms.$gte = minRooms;
      if (maxRooms != null && maxRooms !== Infinity)
        filter.rooms.$lte = maxRooms;
    }
    if (minPrice != null || maxPrice != null) {
      filter.price = {};
      if (minPrice != null) filter.price.$gte = minPrice;
      if (maxPrice != null && maxPrice !== Infinity)
        filter.price.$lte = maxPrice;
    }
    if (minSize != null || maxSize != null) {
      filter.size = {};
      if (minSize != null) filter.size.$gte = minSize;
      if (maxSize != null && maxSize !== Infinity) filter.size.$lte = maxSize;
    }
    if (status && status !== "") {
      filter.status = status;
    }
    if (furnished) filter.furnished = true;
    if (airConditioning) filter.airConditioning = true;
    if (parking) filter.parking = true;
    if (balcony) filter.balcony = true;
    if (elevator) filter.elevator = true;
    if (storage) filter.storage = true;

    // מיון לפי sort
    let sortOption = {};
    switch (sort) {
      case "מחיר(מהנמוך לגבוה)":
        sortOption = { price: 1 };
        break;
      case "מחיר(מהגבוה לנמוך)":
        sortOption = { price: -1 };
        break;
      case "שטח(מהנמוך לגבוה)":
        sortOption = { size: 1 };
        break;
      case "שטח(מהגבוה לנמוך)":
        sortOption = { size: -1 };
        break;
      case "הכי חדש":
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = {};
    }

    const skip = (page - 1) * limit;

    const total = await Property.countDocuments(filter);

    const properties = await Property.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      properties,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("שגיאה בסינון נכסים:", error.message);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});
// שליפת נתונים אישיים
app.get("/users", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select(
      "fullName email phoneNumber userName role"
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

//להשיג רשימה של משתמשים
app.get("/getAllUsers", authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("שגיאה בסינון נכסים:", error.message);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});
//למחוק משתמש
app.delete("/deleteUser/:id", authenticate, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Property.deleteMany({ userId: req.params.id });
    res.status(200).json({ message: "המשתמש והנכסים נמחקו בהצלחה" });
  } catch (error) {
    res.status(500).json({ error: "שגיאה במחיקה" });
  }
});
//לחסום משתמש
app.put("/blockUser/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({
      message: user.isBlocked ? "המשתמש נחסם" : "המשתמש שוחרר בהצלחה",
      isBlocked: user.isBlocked,
      id: user._id,
    });
  } catch (err) {
    console.error("שגיאה בחסימה:", err);
    res.status(500).json({ error: "שגיאת שרת" });
  }
});
// מושכת נתוני משתמש שנבחר לעריכה
app.get("/admin/users/:id", authenticate, isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "fullName email phoneNumber userName"
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

app.put("/admin/users/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { fullName, phoneNumber, email, userName } = req.body;
    const userId = req.params.id;
    const user = await User.findById(userId);
    const phoneNumberExist = await User.findOne({ phoneNumber });
    const userNameExist = await User.findOne({ userName });
    const emailExist = await User.findOne({ email });

    if (!user) {
      return res.status(404).json("משתמש לא נמצא");
    }
    if (userNameExist && userNameExist._id.toString() !== userId) {
      return res.status(400).json({ error: "שם משתמש כבר קיים במערכת" });
    }
    if (phoneNumberExist && phoneNumberExist._id.toString() !== userId) {
      return res.status(400).json({ error: "מספר טלפון כבר קיים במערכת" });
    }
    if (emailExist && emailExist._id.toString() !== userId) {
      return res.status(400).json({ error: "איימל כבר קיים במערכת" });
    }
    user.phoneNumber = phoneNumber;
    user.fullName = fullName;
    user.userName = userName;
    user.email = email;
    await user.save();
    res.status(200).json("הנתונים עודכנו בהצלחה");
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר",
    });
  }
});

app.delete("/properties/prop/delete/:id", authenticate, async (req, res) => {
  try {
    const propertyId = req.params.id;
    await Property.findByIdAndDelete(propertyId);
    return res.status(200).json("נכס נמחק בהצלחה");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
});
app.get(
  "/api/admin/dashboard-stats",
  authenticate,
  isAdmin,
  async (req, res) => {
    try {
      const daysBack = 30;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const fromDate = new Date(today);
      fromDate.setDate(today.getDate() - daysBack + 1);

      const baseUserCountPromise = User.countDocuments({
        createdAt: { $lt: fromDate },
      });

      const basePropertyCountPromise = Property.countDocuments({
        createdAt: { $lt: fromDate },
      });

      // ספירת משתמשים ונכסים נכון ל-00:00 אתמול (למגמה מדויקת כולל מחיקות)
      const yesterdayUserCountPromise = User.countDocuments({
        createdAt: { $lt: today },
      });

      const yesterdayPropCountPromise = Property.countDocuments({
        createdAt: { $lt: today },
      });

      const [
        baseUserCount,
        basePropertyCount,
        totalUsers,
        totalProperties,
        yesterdayUsers,
        yesterdayProps,
        quickUsersRaw,
        propertyTypesRaw,
        userGrowthDailyRaw,
        propertyGrowthDailyRaw,
      ] = await Promise.all([
        baseUserCountPromise,
        basePropertyCountPromise,

        User.countDocuments(),
        Property.countDocuments(),

        yesterdayUserCountPromise,
        yesterdayPropCountPromise,

        User.find().sort({ createdAt: -1 }).limit(5).select("fullName email"),

        Property.aggregate([
          { $group: { _id: "$type", value: { $sum: 1 } } },
          { $project: { _id: 0, name: "$_id", value: 1 } },
          { $sort: { value: -1 } },
        ]),

        User.aggregate([
          { $match: { createdAt: { $gte: fromDate } } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),

        Property.aggregate([
          { $match: { createdAt: { $gte: fromDate } } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

      // בניית גרף משתמשים מצטבר ל-30 ימים
      const dayMapUsers = new Map(
        userGrowthDailyRaw.map(({ _id, count }) => [_id, count])
      );
      const userGrowthDaily = [];
      let runningUserTotal = baseUserCount;
      for (let i = 0; i <= daysBack; i++) {
        const d = new Date(fromDate);
        d.setDate(fromDate.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        const added = dayMapUsers.get(key) || 0;
        runningUserTotal += added;
        userGrowthDaily.push({ day: key, count: runningUserTotal });
      }

      // בניית גרף נכסים מצטבר ל-30 ימים
      const dayMapProperties = new Map(
        propertyGrowthDailyRaw.map(({ _id, count }) => [_id, count])
      );
      const propertyGrowthDaily = [];
      let runningPropertyTotal = basePropertyCount;
      for (let i = 0; i <= daysBack; i++) {
        const d = new Date(fromDate);
        d.setDate(fromDate.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        const added = dayMapProperties.get(key) || 0;
        runningPropertyTotal += added;
        propertyGrowthDaily.push({ day: key, count: runningPropertyTotal });
      }

      // חישוב מגמת משתמשים (אחוז שינוי בין היום לאתמול כולל מחיקות)
      const trendUsers =
        yesterdayUsers > 0
          ? Number(
              (((totalUsers - yesterdayUsers) / yesterdayUsers) * 100).toFixed(
                1
              )
            )
          : null;

      // חישוב מגמת נכסים (אחוז שינוי בין היום לאתמול כולל מחיקות)
      const trendProperties =
        yesterdayProps > 0
          ? Number(
              (
                ((totalProperties - yesterdayProps) / yesterdayProps) *
                100
              ).toFixed(1)
            )
          : null;

      // פעילויות אחרונות (רישום משתמשים, נכסים ועדכוני פרופיל)
      const [recentUsersRaw, recentPropsRaw, recentProfileUpdates] =
        await Promise.all([
          User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("fullName createdAt")
            .lean(),
          Property.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("header createdAt")
            .lean(),
          User.find({ $expr: { $gt: ["$updatedAt", "$createdAt"] } })
            .sort({ updatedAt: -1 })
            .limit(10)
            .select("fullName updatedAt")
            .lean(),
        ]);

      const activities = [
        ...recentUsersRaw.map((u) => ({
          text: `🆕 משתמש ${u.fullName} נרשם`,
          date: u.createdAt,
        })),
        ...recentPropsRaw.map((p) => ({
          text: `🏠 נוספה מודעה “${p.header}”`,
          date: p.createdAt,
        })),
        ...recentProfileUpdates.map((u) => ({
          id: `upd-${u._id}`,
          text: `🔧 ${u.fullName} עדכן את הפרופיל שלו`,
          date: u.updatedAt,
        })),
      ]
        .sort((a, b) => b.date - a.date)
        .slice(0, 10);

      // שליחה ל-Frontend
      res.json({
        users: totalUsers,
        properties: totalProperties,
        trendUsers,
        trendProperties,
        userGrowthDaily,
        propertyGrowthDaily,
        propertyTypes: propertyTypesRaw,
        activities,
        quickUsers: quickUsersRaw,
      });
    } catch (err) {
      console.error("Dashboard stats error:", err);
      res.status(500).json({ error: "שגיאה בשרת" });
    }
  }
);

// יצירת השרת
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
connectDB();
