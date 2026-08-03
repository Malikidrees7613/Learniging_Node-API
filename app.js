// http://localhost:3000/
const express = require("express");
const app = express();
const product_route = require("./routes/route_product");
const port = 3000;

app.get("/", (req, res) => {
    // res.send(200);
    res.send("Server is up and running!");
})
app.use("/api/products", product_route);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})