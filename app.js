// http://localhost:3000/
const express = require("express");
const app = express();

const port = 3000;

app.get("/", (req, res) => {
    // res.send(200);
    res.send("Server is up and running!");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})