const express = require("express");
const app = express();

const port = 3000;

const connectDB = require("./db/connectDB");

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();