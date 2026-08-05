const Product = require("../models/productsSchema");

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
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 15;
    let skip = (page - 1) * limit;

    apiData = apiData.skip(skip).limit(limit);
    console.log(queryObject);
    const product_data = await apiData;
    res.status(200).json({ product_data });
}

module.exports = { getAllProducts };