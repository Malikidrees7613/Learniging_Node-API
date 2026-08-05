// http://localhost:3000/
require("dotenv").config();
const express = require("express");
const app = express();

const product_route = require("./routes/productRoute");
const auth_route = require("./routes/authRoute");
const port = 3000;

app.get("/", (req, res) => {
    // res.send(200);
    res.send("Server is up and running!");
})
app.use(express.json());
app.use("/api/products", product_route);
app.use("/api/auth", auth_route);
app.use(express.static('public'));

module.exports = app;
