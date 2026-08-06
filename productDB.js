require("dotenv").config();
const connect_db = require("./db/connectDB");
const Product = require("./models/productsSchema");

const product_data = require("./products.json");

const start = async () => {
    try {
        await connect_db(process.env.MongoDB_URL);
        console.log("Connected to MongoDB");
        await Product.deleteMany();
        await Product.create(product_data);
        console.log("All products inserted successfully!");
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

start();
