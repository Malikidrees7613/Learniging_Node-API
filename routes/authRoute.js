const express = require("express");
const router = express.Router();

const { register, login, verifyOTP, resendOTP } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.route("/register").post(register);
router.route("/verify-otp").post(verifyOTP);
router.route("/resend-otp").post(resendOTP);
router.route("/login").post(login);
router.route("/logout").post(protect, logout);

module.exports = router;