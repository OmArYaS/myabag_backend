import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 50,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  age: {
    type: Number,
    required: true,
    min: 0,
  },

  address: {
    type: String,
    required: true,
    trim: true,
  },

  phone: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^[0-9]{10,15}$/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },

  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],

  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],

  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: {
    type: String,
  },

  resetPasswordExpire: {
    type: Date,
  },
});

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = mongoose.model("User", userSchema);
