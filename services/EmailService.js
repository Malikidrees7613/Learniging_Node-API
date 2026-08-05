const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const genrateOTP = () => {
    try {
        return Math.floor(1000 + Math.random() * 9000).toString();
    } catch (error) {
        res.status(500).json({ message: "Error in genrating OTP" })
        console.log("Error in genrating OTP", error);
    }
}

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email",
        html: `<p>Your OTP is ${otp}</p>`
    };
    await transporter.sendMail(mailOptions);

};

module.exports = { genrateOTP, sendOTPEmail };