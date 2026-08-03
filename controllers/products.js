const Product = require("../models/schema_products");

const getAllProducts = async (req, res) => {
    const { category } = req.query;
    const queryObject = {};
    if (category) {
        queryObject.category = category;
    }
    const product_data = await Product.find(queryObject);
    res.status(200).json({ product_data });
}

module.exports = { getAllProducts };