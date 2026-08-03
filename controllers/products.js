const getAllProducts = (req, res) => {
    res.status(200).json({ message: "geting all products" });
}
module.exports = getAllProducts;