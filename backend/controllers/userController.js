import userModal from '../modals/userModal.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';  

// Login function
const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    
    try{
        const user=await userModal.findOne({email});
        if(!user){
            return res.json({ success:false, message:"User Does not exist"});
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({ success:false, message:"Invalid credentials"});
        }

        const token=createToken(user._id);
        res.json({success:true, token});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:"Internal server error"});
    }
}


// Create A token
const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET);
}


// Register function
const registerUser=async(req,res)=>{
    const {username,email,password}=req.body;
    try{
        const exists=await userModal.findOne({email})
        if(exists){
            return res.json({success:false,message:"User already exists"});
        }

        // validation
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Enter a valid Email"});
        }

        if(password.length< 8){
            return res.json({success:false,message:"Password must be at least 8 characters"});
        }

        // if everything works
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        
        // new user
        const newUser=new userModal({
            username:username,
            email:email,
            password:hashedPassword 
        })

        const user=await newUser.save();

        const token=createToken(user._id);
        res.json({success:true,token});


    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Internal Server Error"});
    }
}

export {loginUser,registerUser };