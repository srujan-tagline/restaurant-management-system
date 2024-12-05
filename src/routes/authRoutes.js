const express = require("express");
const passport = require("passport");
const initializePassport = require("../../config/passport");
const {
  signup,
  login,
  verifyOTP,
  googleCallback,
} = require("../controllers/authController");
const { loginSchema, signupSchema, verifyOTPSchema } = require("../validators/authValidation");
const validate = require("../middlewares/validate");
const router = express.Router();
initializePassport(passport);
router.use(passport.initialize());
router.use(passport.session());

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/verify-otp", validate(verifyOTPSchema), verifyOTP);

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

module.exports = router;
