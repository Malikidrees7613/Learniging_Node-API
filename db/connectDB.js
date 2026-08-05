const mongoose = require("mongoose");

const connect_db = (uri) => {
    console.log("Connecting to MongoDB...");
    const connectionUri = uri ?? process.env.MongoDB_URL;
    if (typeof connectionUri !== "string" || connectionUri.trim() === "") {
        throw new Error("Invalid connection URI");
    }
    return mongoose.connect(connectionUri);
}

module.exports = connect_db;
