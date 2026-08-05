const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        maxLength: [50, "Product name must be 50 characters or fewer"]
    }, price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Product price cannot be negative"]
    }, description: {
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
