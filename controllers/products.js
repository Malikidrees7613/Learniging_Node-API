const Product = require("../models/schema_products");

const getAllProducts = async (req, res) => {
    const { category, name, price, sort } = req.query;
    const queryObject = {};
    if (category) {
        queryObject.category = category;
    }
    if (name) {
        queryObject.name = { $regex: name, $options: "i" };
    }
    if (price) {
        queryObject.price = { $lte: Number(price) };
    }
    let apiData = Product.find(queryObject);

    if (sort) {
        let sortFix = sort.replace(",", " ");
        apiData = apiData.sort(sortFix);
    }
    console.log(queryObject);
    const product_data = await apiData;
    res.status(200).json({ product_data });
}

module.exports = { getAllProducts };