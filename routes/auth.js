const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../models/User");
// const CryptoJS  = require("crypto-js");
const bcrypt = require("bcrypt");
var nodemailer = require('nodemailer');




// REGISTER
router.post("/register" , async (req,res)=>{
    const Password = await bcrypt.hash(req.body.password, 10);
    const hashedPassword = Password.toString();
    const newUser = new User({
        username: req.body.username,
        email : req.body.email,
        password: hashedPassword,
    });
    try{
        const savedUSer = await newUser.save();
        res.status(201).json(savedUSer);
    }catch(err){
        res.status(500).json(err);
    }
});

// Login 
router.post("/login", async (req,res)=>{
    try{
        const user = await User.findOne({username: req.body.username});
        if(!user){
            res.status(401).json("Wrong credential");
        }
        // const hasedPassword = CryptoJS.AES.decrypt(user.password , process.env.PASS_SEC);
        // const originalPassword = hasedPassword.toString(CryptoJS.enc.Utf8);
        const originalPassword = await bcrypt.compare(req.body.password, user.password );
        // console.log(originalPassword);
        if(!originalPassword ){
            res.status(401).json("Wrong Password or email");
        }
        // jwt 
        const accessToken = jwt.sign(
            {   
                id: user._id,
                isAdmin: user.isAdmin,
            },
             process.env.JWT_SEC,
            {expiresIn:"3d"}
        );    
        const { password, ...others } = user._doc; 
        console.log(user._doc);
        res.status(200).json({...others, accessToken});
    }catch(err){
        res.status(500).json(err);
    }
});





module.exports = router;