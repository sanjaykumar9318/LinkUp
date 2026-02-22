import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
 const protectedRoute = async(req,res,next)=>{    //only check if user is logged in on every req to keep it protected
    try{
        const token = req.cookies.jwt
        if(!token){
           return res.status(401).json({message:"unauthorized: no token provided"})
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET)
        if(!decode){
            res.status(401).json({message:"unauthorized: invalid token"})
        }

        const user = await User.findById(decode.userId).select("-password")
        if(!user){
            res.status(404).json({message:"user not found"})
        }

        req.user = user
        next()

    }
    catch(err){
        console.log("error in protect middleware",err.message)
         res.status(500).json({message:"internal server error"});
    }
}
export default protectedRoute