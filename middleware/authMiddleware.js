// lets protect all api endpoints behind jwt
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];

    }
    if (!token) {
        res.status(401).json({ message: "Not authorized to access this resource" });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
            res.status(401).json({ message: "Not authorized to access this resource" });
            return;
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Not authorized to access this resource" });
        return;
    }
}

module.exports = { protect };
