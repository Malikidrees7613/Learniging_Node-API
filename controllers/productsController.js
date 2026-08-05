const Product = require("../models/productsSchema");

const getAllProducts = async (req, res) => {
    const { category, name, price, sort, select } = req.query;
    const queryObject = {};
    if (category) {
        queryObject.category = category;
    }
    if (name) {
        const escapeName = name.replace(/[*+?^${}()|[\]\\]/g, "\\$&");
        queryObject.name = { $regex: escapeName, $options: "i" };
    }
    if (price != undefined) {
        const maxPrice = Number(price);
        if (!Number.isFinite(maxPrice)) {
            return res.status(400).json({ message: "Invalid price" })
        }
        queryObject.price = { $lte: maxPrice };
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
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const limit = req.query.limit === undefined ? 15 : Number(req.query.limit);
    if (!Number.isSafeInteger(page) || page < 1 || limit > 100) {
        return res.status(400).json({ message: "Invalid page or limit" })
    }
    const skip = (page - 1) * limit;
    apiData = apiData.skip(skip).limit(limit);
    console.log(queryObject);
    const product_data = await apiData;
    res.status(200).json({ product_data });
}

module.exports = { getAllProducts };