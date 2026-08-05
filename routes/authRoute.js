const express = require("express");
const router = express.Router();

const { register, login, verifyOTP, resendOTP } = require("../controllers/authController");

router.route("/register").post(register);
router.route("/verify-otp").post(verifyOTP);
router.route("/resend-otp").post(resendOTP);
router.route("/login").post(login);


module.exports = router;