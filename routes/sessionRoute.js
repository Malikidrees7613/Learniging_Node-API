const express = require("express");
const router = express.Router();
const { getMySessions, deleteSession, logoutAllSessions } = require("../controllers/sessionController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getMySessions);
router.delete("/logoutAll", protect, logoutAllSessions);
router.delete("/:id", protect, deleteSession);

module.exports = router;