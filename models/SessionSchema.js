const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    Device: {
        type: String, default: "Unknown"
    },
    IpAddress: {
        type: String, default: ""
    },
    IsActive: {
        type: Boolean, default: true
    },
    CreatedAt: {
        type: Date, default: Date.now
    },
    ExpiresAt: {
        type: Date,
        required: true
    },
    LastActivityAt: {
        type: Date,
        default: Date.now
    },
    RevokedAt: {
        type: Date,
        default: null
    }

});

SessionSchema.methods.isTokenExpired = function () {
    return Date.now() > this.ExpiresAt;
};

SessionSchema.methods.isTokenRevoked = function () {
    return this.RevokedAt !== null;
};

module.exports = mongoose.model("Session", SessionSchema);
