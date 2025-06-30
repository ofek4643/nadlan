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
    required: true,
  },
  neighborhood: {
    type: String,
    required: true,
    minlength: 3,
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
    min: 1,
  },
  bathrooms: {
    type: Number,
    default: 1,
    min: 1,
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
});


export default mongoose.model("Property" , propertySchema)