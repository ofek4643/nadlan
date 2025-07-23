import User from "../models/User.js";

// הוספת למעודפים
export const toggleFavoriteProperty = async (req, res) => {
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
}

// שליפת נכסים מעודפים
export const getFavoriteProperties = async (req, res) => {
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
};
