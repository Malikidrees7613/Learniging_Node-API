const Product = require("../models/schema_products");

const getAllProducts = async (req, res) => {
    const product_data = await Product.find(req.query);
    res.status(200).json({ product_data });
}

module.exports = { getAllProducts };