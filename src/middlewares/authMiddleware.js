import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectRoute = async (req,res,next)=>{
    
    try {
        const token = await req.cookies.jwt ;
        if (!token){
            return res.status(401).json({error:"Unauthorized - No token provided!"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized-Invalid Token"})
        }
        req.user = await User.findById(decoded.userId).select("-password");
        next();
        
    } catch (error) {
        console.log(`Error in the authMiddleware : ${error}`);
        res.status(500).json({error:"Internal server error"});
    }
}
