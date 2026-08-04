const express = require("express");
const router = express.Router();

const { getAllProducts } = require("../controllers/products");
const { protect } = require("../middleware/middleware_auth");

router.route("/").get(protect, getAllProducts);
module.exports = router;