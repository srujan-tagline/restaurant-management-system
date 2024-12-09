const { generateToken, hashPassword, response } = require("../utils/common");
const { statusCode, responseMessage } = require("../utils/constant");
const sendEmail = require("../utils/sendEmail");
const {
  findUserByEmail,
  createUser,
  saveUser,
} = require("../services/userService");
const { generateOTP, generateOTPExpiry } = require("../utils/otp");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      if (!existingUser.isVerified) {
        const otp = generateOTP();
        const otpExpiresAt = generateOTPExpiry();

        await sendEmail(email, "OTP Verification", `Your OTP is: ${otp}`);
        existingUser.otp = otp;
        existingUser.otpExpiresAt = otpExpiresAt;
        await saveUser(existingUser);

        return response(
          false,
          res,
          statusCode.FORBIDDEN,
          responseMessage.VERIFY_EMAIL_SENT
        );
      }

      return response(
        false,
        res,
        statusCode.BAD_REQUEST,
        responseMessage.EMAIL_ALREADY_USE
      );
    }

    const hashedPassword = await hashPassword(password);
    const otp = generateOTP();
    const otpExpiresAt = generateOTPExpiry();

    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpiresAt,
    });

    await sendEmail(email, "OTP Verification", `Your OTP is: ${otp}`);

    return response(
      true,
      res,
      statusCode.CREATED,
      responseMessage.SIGNUP_SUCCESSFUL
    );
  } catch (error) {
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.SIGNUP_FAILED,
      error.message
    );
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return response(
        false,
        res,
        statusCode.NOT_FOUND,
        responseMessage.INVALID_EMAIL
      );
    }

    if (!user.isVerified) {
      const otp = generateOTP();
      const otpExpiresAt = generateOTPExpiry();

      await sendEmail(email, "OTP Verification", `Your OTP is: ${otp}`);
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
      await saveUser(user);

      return response(
        false,
        res,
        statusCode.FORBIDDEN,
        responseMessage.NOT_VERIFIED_VERIFICATION_EMAIL_SENT
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response(
        false,
        res,
        statusCode.UNAUTHORIZED,
        responseMessage.INVALID_PASSWORD
      );
    }

    const token = generateToken({ email: email, id: user._id }, "1d");
    return response(
      true,
      res,
      statusCode.SUCCESS,
      responseMessage.LOGIN_SUCCESSFUL,
      token
    );
  } catch (error) {
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.LOGIN_FAILED,
      error.message
    );
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return response(
        false,
        res,
        statusCode.NOT_FOUND,
        responseMessage.USER_NOT_FOUND
      );
    }

    if (user.isVerified) {
      return response(
        false,
        res,
        statusCode.BAD_REQUEST,
        responseMessage.USER_ALREADY_VERIFIED
      );
    }

    if (user.otp !== otp) {
      return response(
        false,
        res,
        statusCode.BAD_REQUEST,
        responseMessage.INVALID_OTP
      );
    }

    if (user.otpExpiresAt < Date.now()) {
      return response(
        false,
        res,
        statusCode.BAD_REQUEST,
        responseMessage.OTP_EXPIRED
      );
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await saveUser(user);

    return response(
      true,
      res,
      statusCode.SUCCESS,
      responseMessage.USER_VERIFIED
    );
  } catch (error) {
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.OTP_VERIFICATION_FAILED,
      error.message
    );
  }
};

// Google OAuth Callback Controller
const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const token = generateToken({ email: user.email, id: user._id }, "1d");
    return response(
      true,
      res,
      statusCode.SUCCESS,
      responseMessage.GOOGLE_AUTHENTICATION_SUCCESSFUL,
      token
    );
  } catch (error) {
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.GOOGLE_AUTHENTICATION_FAILED
    );
  }
};

module.exports = { signup, login, verifyOTP, googleCallback };
