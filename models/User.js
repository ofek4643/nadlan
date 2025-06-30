import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  phoneNumber: { type: String, unique: true },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

export default mongoose.model("User", userSchema);
