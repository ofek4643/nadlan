import User from "../models/User.js";
import Property from "../models/Property.js";

// שולח התראה לבעל הנכס על צפייה
export const sendViewAlert = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "נכס לא נמצא" });

    const ownerId = property.userId.toString();
    const viewerId = req.user.userId;

    if (ownerId === viewerId) {
      return res.status(200).json({ message: "זה הנכס שלך – אין התראה" });
    }

    const viewer = await User.findById(viewerId).select("userName");
    const viewerName = viewer?.userName || "משתמש";

    // בדוק אם כבר קיימת התראה כזו
    const owner = await User.findById(ownerId);
    const existingAlert = owner.alerts.find(
      (alert) =>
        alert.property.toString() === property._id.toString() &&
        alert.viewerName === viewerName
    );

    if (existingAlert) {
      return res.status(200).json({ message: "התראה כבר קיימת" });
    }

    // אם לא קיימת, מוסיפים התראה חדשה
    await User.findByIdAndUpdate(ownerId, {
      $push: {
        alerts: {
          property: property._id,
          viewerName,
          viewedAt: new Date(),
        },
      },
    });

    res.status(200).json({ message: "התראה נשלחה לבעל הנכס" });
  } catch (err) {
    console.error("view error:", err);
    res.status(500).json({ error: "שגיאת שרת" });
  }
};

// שליפת התראות
export const getAlerts = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: "alerts.property",
        select: "header",
      })
      .select("alerts");

    if (!user) return res.status(404).json({ error: "משתמש לא נמצא" });

    const sortedAlerts = user.alerts
      .sort((a, b) => b.viewedAt - a.viewedAt)
      .slice(0, 20);

    const alertsText = sortedAlerts.map((a) => ({
      _id: a._id,
      text: `${a.viewerName} צפה בנכס שלך ${a.property.header}`,
      isNewAlert: a.isNewAlert,
    }));

    res.json({ alerts: alertsText });
  } catch (err) {
    console.error("alerts error:", err);
    res.status(500).json({ error: "שגיאת שרת" });
  }
};

// מחיקת כל התראות
export const deleteAllAlerts = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "משתמש לא נמצא" });
    user.alerts = [];
    await user.save();
    res.status(200).json({ message: "ההתראות נמחקו בהצלחה" });
  } catch (error) {
    console.error("שגיאה במחיקת התראות:", error);
    res.status(500).json({ error: "שגיאה במחיקה" });
  }
};

// מחיקת התראה לפי ID
export const deleteAlertById = async (req, res) => {
  try {
    const alertId = req.params.id;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "משתמש לא נמצא" });
    const alert = user.alerts.id(alertId);
    if (!alert) return res.status(404).json({ error: "התראה לא נמצאה" });
    alert.deleteOne();
    await user.save();
    res.status(200).json({ message: "ההתראה נמחקה בהצלחה" });
  } catch (error) {
    console.error("שגיאה במחיקת התראה:", error);
    res.status(500).json({ error: "שגיאה במחיקה" });
  }
};

// שליפה של התראות חדשות בלבד
export const getNewAlerts = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "משתמש לא נמצא" });

    const newAlerts = user.alerts.filter((alert) => alert.isNewAlert === true);

    res.status(200).json({ newAlerts });
  } catch (error) {
    console.error("שגיאה בשליפת התראות חדשות:", error);
    res.status(500).json({ error: "שגיאת שרת" });
  }
};

// עדכון התראה לנקראה
export const markAlertAsRead = async (req, res) => {
  try {
    const alertId = req.params.id;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "משתמש לא נמצא" });
    const alert = user.alerts.id(alertId);
    if (!alert) return res.status(404).json({ error: "התראה לא נמצאה" });
    alert.isNewAlert = false;
    await user.save();
    res.status(200).json({ message: "ההתראה נצפתה בהצלחה" });
  } catch (error) {
    console.error("שגיאה בעדכון התראה:", error);
    res.status(500).json({ error: "שגיאת שרת" });
  }
};
