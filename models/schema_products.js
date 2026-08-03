const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        maxLength: [50, "Product name should be less than 50 characters"]
    },
    price: {
        type: Number,
        required: [true, "Product price is required"]
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: [true, "Product image is required"]
    },
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Product", ProductSchema);
