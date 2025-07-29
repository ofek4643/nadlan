import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import authRouter from "./routes/auth.js";
import propertyRouter from "./routes/property.js"
import alertsRouter from "./routes/alerts.js"
import favoriteRouter from "./routes/favorite.js"
import userRouter from "./routes/user.js"
import adminRouter from "./routes/admin.js"

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://nadlan-react1.onrender.com",
  "https://nadlan-lxn4.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        return callback(new Error("CORS policy does not allow access"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

const port = process.env.PORT || 3000;

// חיבור המסד נתונים
connectDB();

// הגבלת בקשות לשרת מאותו המשתמש
const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: "שלחת יותר מידי בקשות אנא תמתין כמה דקות",
});

app.use(globalLimiter);

// שימוש ב route
app.use("/api/auth", authRouter);
app.use("/api/property", propertyRouter);
app.use("/api/alerts" , alertsRouter)
app.use("/api/favorites" , favoriteRouter)
app.use("/api/user" , userRouter)
app.use("/api/admin" , adminRouter)

// יצירת השרת
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
