import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export async function register(req, res) {
  try {
    const { username, email, password, ...rest } = req.body;
    // تأكد من وجود كل الحقول المطلوبة
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required." });
    // تأكد من أن الإيميل صحيح
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format." });
    // تأكد من أن الباسورد قوي
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (!passwordRegex.test(password))
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number, no symbols.",
      });
    // تأكد من أن اليوزر نيم صحيح
    const usernameRegex = /^[a-zA-Z0-9_\s]{3,20}$/;
    if (!usernameRegex.test(username))
      return res.status(400).json({
        message:
          "Username must be 3-20 characters long and can contain letters, numbers, underscores, and spaces.",
      });
    // تأكد من أن باقي الحقول صحيحة
    const restKeys = Object.keys(rest);
    const validKeys = ["age", "address", "phone"];
    for (const key of restKeys) {
      if (!validKeys.includes(key)) {
        return res.status(400).json({ message: `Invalid field: ${key}` });
      }
    }
    // تأكد من أن باقي الحقول صحيحة

    // هل الإيميل أو اليوزر موجودين؟
    if (await User.exists({ $or: [{ email }, { username }] }))
      return res.status(409).json({ message: "User already exists." });

    // تشفير الباسورد
    // const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password,
      ...rest, // age, address, phone...
    });

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, username, email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // جِيب المستخدم + الباسورد (select:false في السكيمة)
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    // قارن الباسورد
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user._id, username: user.username, email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// controllers/authController.js

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(200)
      .json({ message: "If user exists, reset link sent." });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashed;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 دقيقة

  await user.save();

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/reset-password/${resetToken}`;

  // هنا تبعت الإيميل للمستخدم
  // استخدم sendEmail من utils/sendEmail.js
  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <h3>Reset Your Password</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  });

  // هنا تبعت الإيميل فعليًا باستخدام nodemailer أو أي خدمة
  console.log(`🔗 Reset URL: ${resetUrl}`);

  res.json({ message: "Reset link sent (check console if testing)." });
};

export const resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token." });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({ message: "Password has been reset." });
};
