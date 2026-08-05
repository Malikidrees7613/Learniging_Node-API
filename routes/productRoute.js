const express = require("express");
const router = express.Router();

const { getAllProducts } = require("../controllers/productsController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getAllProducts);
module.exports = router;