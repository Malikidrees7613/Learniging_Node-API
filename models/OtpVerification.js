const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date },
    attempt: { type: Number, default: 0 },
    maxAttempt: { type: Number, default: 3 },
    isVerified: { type: Boolean, default: false },
});

OTPSchema.methods.isExpired = function () {
    return this.expiresAt < Date.now();
};
OTPSchema.methods.incrementAttempt = function () {
    this.attempt += 1;
    return this.attempt;
};

module.exports = mongoose.model("OTP", OTPSchema);
