
import User from "../models/user.model.js";
import { sendOtpMail } from "../utils/mail.js";
import genToken from "../utils/token.js";
import bcrypt from "bcryptjs";


export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User Already Exist" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "PassWord Must Be At Least 6 Characters." })
        }
        if (mobile.length < 10) {
            return res.status(400).json({ message: "Mobile number Must Be At Least 10 digits." })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // creating new user login in db and save it 
        user = await User.create({
            fullName,
            email,
            mobile,
            role,
            password: hashedPassword
        })

        // passing mongo db user id to token 
        const token = await genToken(user._id);
        res.cookie("token", token, {
            // when using http use secure false 
            secure: false,
            // whenver secure false use same site strict 
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
            // httpOnly: true JavaScript on frontend cannot access it (prevents XSS attacks). 
        })
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json(`Sign up error ${error}`);
    }
}


export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User Not Exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect Password" })
        }

        // passing mongo db user id to token 
        const token = await genToken(user._id);
        res.cookie("token", token, {
            // when using http use secure false 
            secure: false,
            // whenver secure false use same site strict 
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
            // httpOnly: true JavaScript on frontend cannot access it (prevents XSS attacks). 
        })
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(`Sign in error ${error}`);
    }
}

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "log out sucessfully" })
    } catch (error) {
        return res.status(500).json(`Sign Out error ${error}`)
    }
}

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "user not exist" })
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false
        await user.save()
        await sendOtpMail(email, otp)
        return res.status(200).json({ message: "Otp sent succesfully" })
        // generated otp and inserted it into database 
    } catch (error) {
        return res.status(500).json(`Otp error ${error}`)
    }
}


export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email })
        if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid / Otp Expired" })
        }
        user.isOtpVerified = true
        user.resetOtp = undefined
        user.otpExpires = undefined
        await user.save()
        return res.status(200).json({ message: "Otp Verified succesfully" })
    } catch (error) {
        return res.status(500).json(`Otp error ${error}`)
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, newPasword } = req.body
        const user = await User.findOne({ email })
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "OTP Verification Required" })
        }
        const hashedPassword = await bcrypt.hash(newPasword, 10)
        user.password = hashedPassword
        user.isOtpVerified = false
        await user.save()
        return res.status(200).json({ message: "Password reset succesfully" })
    } catch (error) {
        return res.status(500).json(`reset password error ${error}`)
    }
}

export const googleAuth = async (req, res) => {
    try {
        const { fullName, email, mobile } = req.body
        let user = await User.findOne({ email })
        if (!user) {
            user = await User.create({ fullName, email, mobile, role })
        }
        const token = await genToken(user._id);
        res.cookie("token", token, {
            // when using http use secure false 
            secure: false,
            // whenver secure false use same site strict 
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
            // httpOnly: true JavaScript on frontend cannot access it (prevents XSS attacks). 
        })
    } catch (error) {

    }
}