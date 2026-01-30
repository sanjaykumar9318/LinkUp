import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import generateToken from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js";

export const signup = async(req,res)=>{
    const{fullname,email,password} = req.body
    try{
        if(!fullname || !email || !password){
            return res.status(400).json({message:"Please fill all the fields"});
        }
        if (password.length<6){
            return res.status(400).json({message:"Password length should be atleast 6 characters"});
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser = new User({
            fullname:fullname,email:email,password:hashedPassword
        })
        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                email:newUser.email,
                fullname:newUser.fullname,
                profilepic:newUser.profilepic,

        })}
        else{
            res.status(400).json({message:"invalid user"});
        }
    }
    catch(err){
         console.log("error in signup controller",err.message)
         res.status(500).json({message:"internal server error"});
    }
}

export const login = async(req,res)=>{
    const {email,password} = req.body
    const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        const ispassword=await bcrypt.compare(password,user.password)
        if(!ispassword){
            return res.status(400).json({message:"Invalid credentials"});
        }
        generateToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            email:user.email,
            fullname:user.fullname,
            profilepic:user.profilepic,
        })
}

export const logout = (req,res)=>{
     try{
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({message:"Logout successful"});
    }
    catch(err){
        console.log("Error in logout controller",err.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const updateprofile = async(req,res)=>{
    try{
        console.log("REQ.USER:", req.user);
        const {profilepic} = req.body
        if (!profilepic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }
        const userId = req.user._id
        const uploadresponse=await cloudinary.uploader.upload(profilepic);
        console.log(uploadresponse)
        const updatedUser=await User.findByIdAndUpdate(userId,{profilepic:uploadresponse.secure_url},{new:true});
        res.status(200).json(updatedUser)
    }
    catch(err){
        console.log("Error in updateProfile controller",err.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const checkAuth = (req,res)=>{
    try{
        res.status(200).json({_id: req.user._id,
    fullname: req.user.fullname,
    email: req.user.email,
    profilepic: req.user.profilepic})
    }
    catch(err){
        console.log("Error in checkauth controller",err.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}
