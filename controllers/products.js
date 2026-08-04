const Product = require("../models/schema_products");

const getAllProducts = async (req, res) => {
    const { category, name, price, sort, select } = req.query;
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
        let sortFix = sort.split(",").join(" ");
        apiData = apiData.sort(sortFix);
    }

    if (select) {
        let selectFix = select.split(",").join(" ");
        apiData = apiData.select(selectFix);
    }
    console.log("filters are runing");
    const product_data = await apiData;
    res.status(200).json({ product_data });
}

module.exports = { getAllProducts };