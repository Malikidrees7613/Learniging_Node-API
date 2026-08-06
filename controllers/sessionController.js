const { getActiveSessions, revokeSessionForUser, revokeAllSession } = require("../services/SessionService");

const getMySessions = async (req, res) => {
    try {
        const sessions = await getActiveSessions(req.user._id);
        res.status(200).json({ sessions });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteSession = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await revokeSessionForUser(id, req.user._id);
        if (!session) {
            res.status(404).json({ message: "Session not found" });
            return;
        }
        res.status(200).json({ message: "Session deleted successfully", session });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const logoutAllSessions = async (req, res) => {
    try {
        await revokeAllSession(req.user._id);
        res.status(200).json({ message: "All sessions logged out successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getMySessions, deleteSession, logoutAllSessions };