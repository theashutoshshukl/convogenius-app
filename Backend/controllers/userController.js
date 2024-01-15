const dotenv = require("dotenv");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const nodeCache = require('node-cache');

// Dotenv
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;

// Create an instance of the NodeCache class
const cache = new nodeCache();

// Signup
const signup = async (req, res) => {
    const { name, email, password, userOtp } = req.body;
    try {
        // Checking user exist or not
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // Retrieve the OTP value from the cache
        const cachedOTP = cache.get(email);
        // Otp verification
        if (cachedOTP === undefined) {
            return res.status(400).json({ message: "OTP expired or not found" });
        }
        else if (cachedOTP !== userOtp) {
            return res.status(400).json({ message: "OTP did not matched" });
        }

        // Hash user password
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
            return res.status(400).json({ message: "Something went wrong" });
        }

        // User creation
        const newUser = await User.create({
            name: name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        // Signing token
        const token = jwt.sign({ email: newUser.email, id: newUser._id }, SECRET_KEY);
        res.status(201).json({ message: "Signed up successfully", token });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Verification email
const verificationEmail = async (req, res) => {
    const { email } = req.body;
    // generate a random OTP
    function generateOTP() {
        const digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }

    try {
        // Checking user exist or not
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // Genrating OTP
        const genOtp = generateOTP();
        // Saving otp to node-cache
        const otp = genOtp;
        const otpKey = email;
        const otpTTL = 300; // 300 seconds = 5 minutes
        // Store the OTP value in the cache with the specified time-to-live (TTL)
        cache.set(otpKey, otp, otpTTL);

        // Set up Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            },
        });

        // Nodemailer transporter message
        const message = {
            from: EMAIL_FROM,
            to: email,
            subject: 'ConvoGenius || OTP Verification Email',
            html: `<p>Dear User,</p><p>Here is your otp for signup verification:</p><h2>${otp}</h2>`
        };

        // // Sending otp verification email
        transporter.sendMail(message, (error) => {
            if (error) {
                console.log(error);
            } else {
                res.status(200).json({ message: "Otp sent successfully" });
            }
        });

        return res.status(200).json({ message: "OTP Sent Successfully" });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Checking user Exist or not
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Comparing password
        const matchPassword = await bcrypt.compare(password, userExists.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Wrong password" });
        }

        // Signing token
        const token = jwt.sign({ email: userExists.email, id: userExists._id }, SECRET_KEY);
        res.status(200).json({ message: "Logged in successfully", token });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Change password
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        // User Exists
        const userExists = await User.findOne({ _id: req.userId });
        if (!userExists) {
            return res.status(400).json({ message: "User not found" });
        }

        // Password matching
        const matchPassword = await bcrypt.compare(oldPassword, userExists.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Old password did not match" });
        }

        // Hashing the new password
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        if (!newHashedPassword) {
            return res.status(400).json({ message: "Something went wrong" });
        }

        // Updating the password
        userExists.password = newHashedPassword;
        await userExists.save();
        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Forget password
const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // User Existing check
        const userExists = await User.findOne({ email: email });
        if (!userExists) {
            return res.status(400).json({ message: "User not found" });
        }

        // Signing token
        let token = jwt.sign({ email: userExists.email, id: userExists._id }, SECRET_KEY, { expiresIn: '15m' });
        let link = `http://localhost:3000/user/reset-password/${token}`;

        // Set up Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            },
        });

        const message = {
            from: EMAIL_FROM,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Dear User,</p><p>Please click the following link to reset your password:</p><p><a href=${link}>Reset Password</a></p>`
        };

        // // Sending password reset email by nodemailer
        transporter.sendMail(message, (error) => {
            if (error) {
                console.log(error);
            } else {
                res.status(200).json({ message: "Email sent Successfully Check your email and click that link to reset your password" });
            }
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Reset password
const resetPassword = async (req, res) => {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;

    try {
        let tokenData = jwt.verify(token, SECRET_KEY)
        if (!tokenData) {
            return res.status(400).json({ message: "Invalid Link Or Expired" });
        }

        // getting user from from token
        const user = await User.findOne({ _id: tokenData.id });
        if (!user) {
            return res.status(400).json({ message: "Invalid Link Or Expired" });
        }

        // checking password and confirmPassword are same or not
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password and Confirm Password must be same" });
        }

        // Hashing new password
        let newHashedPassword = await bcrypt.hash(password, 10);
        if (!newHashedPassword) {
            return res.status(400).json({ message: "Something went wrong" });
        }

        // Updating password
        await User.updateOne({ _id: user.id }, { password: newHashedPassword });

        res.status(200).json({ reseted: "Password Reseted Successfully" });

    } catch (error) {
        return res.status(500).json({ message: "This link has been expired" });
    }
}

// Get user by id
const getUserById = async (req, res) => {
    const { token } = req.params;
    try {
        // Checking token is awailable or not
        if (!token || token === undefined) {
            return res.status(400).json({ message: "Unauthorized please login" });
        }

        // Decoding the user
        const decodedToken = jwt.verify(token, SECRET_KEY);
        if (!decodedToken) {
            return res.status(400).json({ message: "Invalid Token" });
        }

        // Finding the user with req.userId
        const user = await User.findOne({ _id: decodedToken.id }, { password: 0 });
        return res.status(200).json({ user: user });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { signup, verificationEmail, login, changePassword, forgetPassword, resetPassword, getUserById }