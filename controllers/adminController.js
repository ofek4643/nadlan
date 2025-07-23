import User from "../models/User.js";
import Property from "../models/Property.js";

// רשימה של משתמשים
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("שגיאה בשליפת משתמשים:", error.message);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
};

// למחוק משתמש
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Property.deleteMany({ userId: req.params.id });
    res.status(200).json({ message: "המשתמש והנכסים נמחקו בהצלחה" });
  } catch (error) {
    res.status(500).json({ error: "שגיאה במחיקה" });
  }
};

// לחסום משתמש
export const blockUser = async (req, res) => {
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
};

// מושכת נתוני משתמש שנבחר לעריכה
export const getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "fullName email phoneNumber userName"
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// עדכון יוזר על ידי אדמין
export const updateUserByAdmin = async (req, res) => {
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
};

// שליפת כל הלוח בקרה של האדמין
export const getAdminDashboardStats = async (req, res) => {
  try {
    // הגדרת טווח תאריכים של 30 ימים אחורה
    const daysBack = 30;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // איפוס השעה של היום הנוכחי
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - daysBack + 1);

    // שליפת סטטיסטיקות בסיסיות + נתונים גרפיים במקביל
    const [
      baseUserCount, // כמות המשתמשים שהיו לפני 30 יום
      basePropertyCount, // כמות הנכסים שהיו לפני 30 יום
      totalUsers, // סה"כ משתמשים במערכת
      totalProperties, // סה"כ נכסים במערכת
      yesterdayUsers, // כמות משתמשים עד אתמול (למגמה)
      yesterdayProps, // כמות נכסים עד אתמול (למגמה)
      quickUsersRaw, // 5 משתמשים אחרונים להצגה מהירה
      propertyTypesRaw, // כמות נכסים לכל סוג (לגרף עוגה)
      userGrowthDailyRaw, // גדילה יומית של משתמשים ב-30 יום
      propertyGrowthDailyRaw, // גדילה יומית של נכסים ב-30 יום
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $lt: fromDate } }),
      Property.countDocuments({ createdAt: { $lt: fromDate } }),
      User.countDocuments(),
      Property.countDocuments(),
      User.countDocuments({ createdAt: { $lt: today } }),
      Property.countDocuments({ createdAt: { $lt: today } }),
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
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Property.aggregate([
        { $match: { createdAt: { $gte: fromDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // חישוב מגמת שינוי באחוזים (משתמשים / נכסים) לעומת אתמול
    const trendUsers =
      yesterdayUsers > 0
        ? Number(
            (((totalUsers - yesterdayUsers) / yesterdayUsers) * 100).toFixed(1)
          )
        : null;
    const trendProperties =
      yesterdayProps > 0
        ? Number(
            (
              ((totalProperties - yesterdayProps) / yesterdayProps) *
              100
            ).toFixed(1)
          )
        : null;

    // מערכים של גדילה מצטברת ל-30 הימים האחרונים
    const userGrowthDaily = [],
      propertyGrowthDaily = [];
    let runningUserTotal = baseUserCount,
      runningPropertyTotal = basePropertyCount;

    // המרת נתוני האגרגציה למפות נוחות לשימוש
    const dayMapUsers = new Map(
      userGrowthDailyRaw.map(({ _id, count }) => [_id, count])
    );
    const dayMapProperties = new Map(
      propertyGrowthDailyRaw.map(({ _id, count }) => [_id, count])
    );

    // לולאה לכל יום: מוסיף נתונים מצטברים למשתמשים ולנכסים
    for (let i = 0; i <= daysBack; i++) {
      const d = new Date(fromDate);
      d.setDate(fromDate.getDate() + i);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD

      const addedUsers = dayMapUsers.get(key) || 0;
      const addedProps = dayMapProperties.get(key) || 0;

      runningUserTotal += addedUsers;
      runningPropertyTotal += addedProps;

      userGrowthDaily.push({ day: key, count: runningUserTotal });
      propertyGrowthDaily.push({ day: key, count: runningPropertyTotal });
    }

    // שליפת פעולות אחרונות: משתמשים חדשים, נכסים חדשים, עדכוני פרופיל
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

    // בניית רשימת פעולות אחרונות מאוחדת
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
        text: `🔧 ${u.fullName} עדכן את הפרופיל שלו`,
        date: u.updatedAt,
      })),
    ]
      .sort((a, b) => b.date - a.date) // סידור לפי תאריך יורד
      .slice(0, 10); // שמירה על 10 אחרונים

    // החזרת התוצאה הסופית לקליינט
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
};
