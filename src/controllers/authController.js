const User = require("../models/userModel");
const { generateToken, hashPassword } = require("../utils/common");
const sendEmail = require("../utils/sendEmail");
const { generateOTP, generateOTPExpiry } = require("../utils/otp");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.isVerified) {
        const otp = generateOTP();
        const otpExpiresAt = generateOTPExpiry();

        await sendEmail(email, "OTP Verification", `Your OTP is: ${otp}`);
        existingUser.otp = otp;
        existingUser.otpExpiresAt = otpExpiresAt;
        await existingUser.save();

        return res.status(403).json({
          message: "Verification email sent. Please verify your self.",
        });
      }

      return res
        .status(400)
        .json({ message: "Email is already in use by other account." });
    }

    const hashedPassword = await hashPassword(password);
    const otp = generateOTP();
    const otpExpiresAt = generateOTPExpiry();

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpiresAt,
    });

    await sendEmail(email, "OTP Verification", `Your OTP is: ${otp}`);

    return res.status(201).json({
      message:
        "Signup successful. Please verify your self using the OTP sent to the provided email.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Signup failed", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid email. Please provide correct email." });
    }

    if (!user.isVerified) {
      // return res.status(400).json({message: "You are not verified. Please verify your self."});
      const otp = generateOTP();
      const otpExpiresAt = generateOTPExpiry();

      await sendEmail(email, "OTP Verification", `Your OTP is: ${otp}`);
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();

      return res.status(403).json({
        message:
          "You are not verified. Verification email sent. Please verify your self.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ email: email, id: user._id }, "1d");
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiresAt < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please try again." });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "OTP verification failed", error: error.message });
  }
};

// Google OAuth Callback Controller
const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const token = generateToken({ email: user.email, id: user._id }, "1d");
    return res
      .status(200)
      .json({ message: "Google authentication successful", token });
  } catch (error) {
    return res.status(500).json({
      message: "Error during Google OAuth callback",
      error: error.message,
    });
  }
};

module.exports = { signup, login, verifyOTP, googleCallback };
