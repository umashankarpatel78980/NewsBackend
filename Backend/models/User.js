import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email field is not provided"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"]
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"]
    },

    profilePicture: {
      type: String,
      default: ""
    },

    headline: {
      type: String,
      default: ""
    },

    position: {
      type: String,
      default: ""
    },

    education: {
      type: String,
      default: ""
    },

    experience: {
      type: String,
      default: ""
    },

    address: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      default: ""
    },
    articlesCount: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["Pending", "Active", "Inactive", "Banned"],
      default: "Pending"
    },

    role: {
      type: String,
      enum: ["Admin", "Reporter", "User"],
      default: "User"
    },
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    },
    resetOTP: {
      type: String,
      default: null
    },
    resetOTPExpires: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
