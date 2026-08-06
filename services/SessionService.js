const Session = require("../models/SessionSchema");

const SessionDuration = 60 * 60 * 1000;

const CreateSession = async (UserId, { Device = "Unknown", IpAddress = "" }) => {
    try {
        const ExpiresAt = new Date(Date.now() + SessionDuration)
        return Session.create({ UserId, Device, IpAddress, ExpiresAt });
    } catch (error) {
        throw error;

    }
};

const isSessionValid = async (sessionId) => {
    if (!sessionId) return null;
    const session = await Session.findById(sessionId);
    if (!session || !session.IsActive || session.isTokenExpired()) {
        return null;
    }
    session.LastActivityAt = Date.now();
    await session.save();
    return session;
};
const revokeSession = (sessionId) =>
    Session.findByIdAndUpdate(sessionId,
        { RevokedAt: Date.now(), IsActive: false },
        { returnDocument: "after" }
    );
const revokeSessionForUser = (sessionId, userId) =>
    Session.findOneAndUpdate({ _id: sessionId, userId },
        { RevokedAt: Date.now(), IsActive: false },
        { returnDocument: "after" }
    );
const revokeAllSession = (userId) =>
    Session.updateMany({ UserId: userId, IsActive: true },
        { IsActive: false, RevokedAt: Date.now() }
    );
const getActiveSessions = (userId) =>
    Session.find({ UserId: userId, IsActive: true }).sort({ CreatedAt: -1 });


module.exports = { SessionDuration, CreateSession, isSessionValid, revokeSession, revokeSessionForUser, revokeAllSession, getActiveSessions };