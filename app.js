// http://localhost:3000/
require("dotenv").config();
const express = require("express");
const app = express();
const product_route = require("./routes/route_product");
const connect_db = require("./db/connect");
const auth_route = require("./routes/route_auth");
const port = 3000;

app.get("/", (req, res) => {
    // res.send(200);
    res.send("Server is up and running!");
})
app.use(express.json());
app.use("/api/products", product_route);
app.use("/api/auth", auth_route);
app.use(express.static('public'));


const start = async () => {
    try {
        await connect_db();
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();
