const sgMail = require("@sendgrid/mail");


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const genrateOTP = () => {
    try {
        return Math.floor(1000 + Math.random() * 9000).toString();
    } catch (error) {
        console.log("Error in genrating OTP", error);
        throw error;
    }
}

const sendOTPEmail = async (email, otp) => {
    const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: "Verify your email",
        html: `<p>Your OTP is ${otp}</p>`
    };
    await sgMail.send(msg);

};

module.exports = { genrateOTP, sendOTPEmail };