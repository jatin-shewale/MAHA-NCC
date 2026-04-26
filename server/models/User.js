import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { buildCadetId } from "../utils/helpers.js";
import { REGISTRATION_STATUS, ROLES } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CADET
    },
    registrationStatus: {
      type: String,
      enum: Object.values(REGISTRATION_STATUS),
      default: REGISTRATION_STATUS.PENDING
    },
    cadetId: {
      type: String,
      default: buildCadetId,
      unique: true
    },
    rank: String,
    wing: String,
    phone: String,
    address: String,
    profileImage: String,
    badgeScore: {
      type: Number,
      default: 0
    },
    badgeLevel: {
      type: String,
      default: "Rookie"
    },
    achievementStreak: {
      type: Number,
      default: 0
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastActiveAt: Date
  },
  { timestamps: true }
);

userSchema.index({ role: 1, registrationStatus: 1 });
userSchema.index({ name: "text", email: "text", cadetId: "text" });

userSchema.pre("save", async function passwordHash(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
