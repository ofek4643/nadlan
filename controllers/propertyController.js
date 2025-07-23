import Property from "../models/Property.js";

// הוספת נכס
export const addProperty = async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      userId: req.user.userId,
    };

    const newProperty = new Property(propertyData);
    await newProperty.save();

    return res.status(201).json("הנכס נוסף בהצלחה!");
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר",
    });
  }
};

// עדכון נכס
export const editProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.user.userId;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "הנכס לא נמצא" });
    }

    if (property.userId.toString() !== userId) {
      return res.status(403).json({ error: "אין לך הרשאה לערוך נכס זה" });
    }

    const { userId: _userId, ...updateData } = req.body;

    await Property.findByIdAndUpdate(propertyId, updateData, { new: true });

    return res.status(200).json("הנכס עודכן בהצלחה!");
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר",
    });
  }
};

// מציאת מידע על הנכס לפי id
export const getPropertyById = async (req, res) => {
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
};
// קבלת רשימת נכסים עם pagination ומיון
export const listProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const sort = req.query.sort || "";

    const skip = (page - 1) * limit;

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
};

// סינון ומיון נכסים
export const filterProperties = async (req, res) => {
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

    if (type && type !== "") filter.type = type;
    if (city && city !== "") filter.city = city;

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

    if (status && status !== "") filter.status = status;
    if (furnished) filter.furnished = true;
    if (airConditioning) filter.airConditioning = true;
    if (parking) filter.parking = true;
    if (balcony) filter.balcony = true;
    if (elevator) filter.elevator = true;
    if (storage) filter.storage = true;

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
};

// נכסים של המשתמש המחובר
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ userId: req.user.userId });
    res.json(properties);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר",
    });
  }
};

// מחיקת נכס
export const deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    await Property.findByIdAndDelete(propertyId);
    return res.status(200).json("נכס נמחק בהצלחה");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר",
    });
  }
};
