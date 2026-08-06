const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { genrateOTP, sendOTPEmail } = require("../services/EmailService");
const OTP = require("../models/otpVerification");
const SessionService = require("../services/SessionService");

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        const otp = genrateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
        await OTP.findOneAndUpdate(
            { email },
            { otp, expiresAt, attempt: 0, isVerified: false },
            { upsert: true, returnDocument: 'after' }
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
            if (otpData.attempt >= otpData.maxAttempt) {
                res.status(400).json({ message: "Maximum OTP attempts reached" });
                return;
            }
            res.status(400).json({ message: "Invalid OTP" });
            return;
        }
        const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { returnDocument: 'after' });
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
        await OTP.findOneAndUpdate(
            { email },
            { otp, expiresAt, attempt: 0, isVerified: false },
            { upsert: true, returnDocument: 'after' }
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
        const session = await SessionService.CreateSession(user._id, { Device: req.headers["user-agent"] || "Unknown", IpAddress: req.ip || req.socket.remoteAddress });
        const token = jwt.sign({ id: user._id, sessionId: session._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "User logged in successfully", token, sessionId: session._id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const logout = async (req, res) => {
    try {
        // req.session is the current session doc set by protect middleware
        await SessionService.revokeSession(req.session._id);
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { register, verifyOTP, resendOTP, login, logout };