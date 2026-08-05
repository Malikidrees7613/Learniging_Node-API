const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { genrateOTP, sendOTPEmail } = require("../services/EmailService");

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        const otp = genrateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
        await otp.findOneAndUpdate(
            { email },
            { otp, expiresAt, attempt: 0, isVerified: false },
            { upsert: true, new: true }
        )
        await sendOTPEmail(email, otp);
        res.status(201).json({ message: "User created successfully and otp has ben sent to an email" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpData = await OTP.findOne({ email });
        if (!otpData) {
            res.status(400).json({ message: "OTP not found" });
            return;
        }
        if (otpData.isExpired()) {
            res.status(400).json({ message: "OTP expired" });
            return;
        }
        if (otpData.otp !== otp) {
            otpData.attempt += 1;
            await otpData.save();
            res.status(400).json({ message: "Invalid OTP" });
            return;
        }
        if (otpData.attempt >= otpData.maxAttempt) {
            res.status(400).json({ message: "Maximum OTP attempts reached" });
            return;
        }
        const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
        res.status(200).json({ message: "User verified successfully", user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user.isVerified) {
            res.status(400).json({ message: "User already verified" });
            return;
        }
        const otp = genrateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
        await otp.findOneAndUpdate(
            { email },
            { otp, expiresAt, attempt: 0, isVerified: false },
            { upsert: true, new: true }
        )
        await sendOTPEmail(email, otp);
        res.status(200).json({ message: "OTP resent successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        if (!user.isVerified) {
            res.status(400).json({ message: "User not verified" });
            return;
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "User logged in successfully", token });
    } catch (error) {
        console.log(error)
    }
}

module.exports = { register, verifyOTP, resendOTP, login };