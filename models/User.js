import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
    favoriteProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    alerts: [
      {
        property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
        viewerName: String,
        viewedAt: { type: Date, default: Date.now },
        isNewAlert: { type: Boolean, default: true },
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
