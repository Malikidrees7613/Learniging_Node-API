const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error)
    }
}

const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "User logged in successfully", token });
    } catch (error) {
        console.log(error)
    }
}

module.exports = { register, login }