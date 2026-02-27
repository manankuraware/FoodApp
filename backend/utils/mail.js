import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465, //gamil port is 465
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
    // senders email and app password
});


export const sendOtpMail = async (to, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject: "Reset your Password",
        html: `your otp for password reset is <b>${otp}</b>. it expires in 5 mins.`
    })
}

export const sendDeliveryOtpMail = async (user, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "Delivery OTP",
        html: `<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`
    })
}