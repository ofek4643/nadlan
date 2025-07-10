import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  header: {
    type: String,
    required: true,
    minlength: 8,
  },
  description: {
    type: String,
    required: true,
    minlength: 25,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["למכירה", "להשכרה"],
    required: true,
  },
  type: {
    type: String,
    enum: ["דירה", "בית פרטי", "פנטהאוז", "דירת גן", "דופלקס", "מגרש", "מסחרי"],
    required: true,
  },
  city: {
    type: String,
    enum: ["תל אביב", "ירושלים", "חיפה", "רעננה", "הרצליה","רמת גן",
      "באר שבע",
    ],
    required: true,
  },
  neighborhood: {
    type: String,
    required: true,
    minlength: 3,
  },
  street: {
    type: String,
    required: true,
    minlength: 2,
  },
  houseNumber: {
    type: String,
    required: true,
  },
  floor: {
    type: Number,
    default: 0,
    min: 0,
  },
  maxFloor: {
    type: Number,
    default: 0,
    min: 0,
  },
  size: {
    type: Number,
    required: true,
    min: 1,
  },
  rooms: {
    type: Number,
    default: 1,
    min: 0,
  },
  bathrooms: {
    type: Number,
    default: 1,
    min: 0,
  },
  furnished: {
    type: Boolean,
    default: false,
  },
  airConditioning: {
    type: Boolean,
    default: false,
  },
  parking: {
    type: Boolean,
    default: false,
  },
  balcony: {
    type: Boolean,
    default: false,
  },
  elevator: {
    type: Boolean,
    default: false,
  },
  storage: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  favoriteUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    isFavorite: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
});

export default mongoose.model("Property", propertySchema);
