const mongoose = require("mongoose");
const uri = "mongodb+srv://idreeslang007_db_user:afXOglFGzX8EP9qf@nodeapi.ynwv93k.mongodb.net/?appName=NodeAPI";

const connect_db = () => {
    console.log("Connecting to MongoDB...");
    return mongoose.connect(uri);
}

module.exports = connect_db;