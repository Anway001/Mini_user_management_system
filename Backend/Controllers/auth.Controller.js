const userSchema = require("../Models/user.Schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const joi = require("joi");
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

async function register(req, res) {
    
    try {
        const {Fullname , email , password, role } = req.body;

        const Validation = joi.object({
            Fullname : joi.string().required(),
            email : joi.string().email().required(),
            password : joi.string().required(),
            role : joi.string().required(),
        })

        const ExistingUser = await userSchema.findOne({email : email});
        if(ExistingUser){
            return res.status(400).json({message : "User Already Exists"});
        }

        const hashedPassword = await bcrypt.hash(password , 10);
        const newUser = await userSchema.create({
            Fullname,
            email,
            password : hashedPassword,
            role,
        })
        await newUser.save();

        const token = jwt.sign({
            id : newUser._id,
    },JWT_SECRET,{expiresIn : "7d"})
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({message:"User registered successfully", 
            user:{
                    id : newUser._id,
                    email : newUser.email,
                    Fullname : newUser.Fullname,
                    role : newUser.role
                }, token:token});
        
    } catch (error) {
        res.status(500).json({message : "Internal Server Error"});
        console.log(error);
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        if (!user.isActive) {
            return res.status(401).json({ message: "User is Blocked by admin" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                Fullname: user.Fullname
            },
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

async function logout(req, res) {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

async function getCurrentUser(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decodedToken = jwt.verify(token, JWT_SECRET);
        const user = await userSchema.findById(decodedToken.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User found",
            user: {
                id: user._id,
                email: user.email,
                Fullname: user.Fullname
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

module.exports = {register, login, logout, getCurrentUser};