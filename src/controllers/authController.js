import { generateToken } from "../lib/utilis.js";
import User from "../models/userModel.js";

import bcrypt from "bcrypt";



export const signup = async (req, res) => {
    const { email, fullName, password, role } = req.body;
    try {
        if (!email || !fullName || !password) {
            return res.status(400).json({ error: "All fields are required !" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already exists !" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password length must be >6 !" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed_pwd = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            name: fullName, // Fix: use 'name' field in schema
            password: hashed_pwd,
            role
        });
        await newUser.save();
        generateToken(newUser._id, res);
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.name, // Fix: return 'name' as 'fullName'
            email: newUser.email,
            role: newUser.role
        });
    } catch (error) {
        console.log(`Error in the signup controller : ${error}`);
        res.status(500).json({ error: "Internal server error !" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required !" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials !" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: "Invalid credentials !" });
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.name, // Fix: use 'name' field
            role: user.role
        });

    } catch (error) {
        console.log(`Error in login controller : ${error} !`);
        res.status(500).json({ error: "Internal server error !" });
    }
}


export const logout = async (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log(`Error in the logout controller : ${error}`);
        res.status(500).json({error:"Internal server Error"});
    }
}