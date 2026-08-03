const mongoose = require("mongoose");
const uri = process.env.MongoDB_URL;

const connect_db = () => {
    console.log("Connecting to MongoDB...");
    return mongoose.connect(uri);
}

module.exports = connect_db;