// {status: "success" ,data: {adduser}} //standard for resbonse in project
const User_schema = require('../models/users.model')
const {validationResult} = require('express-validator')
const status_code = require('../utils/httpStatus')
const bcrypt = require('bcrypt')
require('dotenv').config()
const CJWT = require('../utils/createJWT')
const asyncWrapper = require('../middlewares/asyncWrapper')
const { update_user } = require('./Users.controller')
const send_Email = require('../utils/send_Email')
const encrypt = require('../utils/encrypt_crypto')




const login = async (req, res) => {
    const {email, password_hash} = req.body;
    try {
        const checkuser = await User_schema.findOne({email});
        if (!checkuser) {
            return res.status(404).json({status: status_code.Fail_Status, data: {checkuser}});
        }
        
        const checkpass = await bcrypt.compare(password_hash, checkuser.password_hash);
        if (!checkpass) {
            return res.status(401).json({status: status_code.Fail_Status, data: "wrong credential"});
        }
        
        const unique = await CJWT(res, {email: checkuser.email, id: checkuser._id, role: checkuser.role});
        
        await User_schema.updateOne(
            { _id: checkuser._id },
            { $set: { token: unique } }
        );
        
        res.cookie("token", unique, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        
        res.status(200).json({
            status: "success",
            message: "login success",
            token: unique,
            user: {
                id: checkuser._id,
                email: checkuser.email,
                role: checkuser.role,
                name: checkuser.name
                // include any other user data you need
            }
        });
    } catch(err) {
        console.error(err);
        return res.status(500).json({status: status_code.Fail_Status, data: "Internal Server Error"});
    }
}

const logout = asyncWrapper(async (req, res) =>  {
    // Iterate through all cookies and clear them
    Object.keys(req.cookies).forEach(cookieName => {
      res.clearCookie(cookieName, {
        httpOnly: true,  // Prevents JavaScript access to cookies
        secure: process.env.NODE_ENV === 'production',  // Use HTTPS in production
        sameSite: 'Lax',  // Adjust according to your requirements
      });
    });
  
    res.send('All cookies have been cleared!');
  });
  

const change_password = asyncWrapper(async (req,res) => {
    const {old_password,new_password} = req.body

    const user_id = req.user.id
    const user = await User_schema.findById(user_id)
    if(!user){
        res.status(404).json({status:status_code.Fail_Status,message:'user Not Found'})
    }
    const check_password = await bcrypt.compare(old_password,req.user.password_hash)
    if(!check_password){
        res.status(404).json({status:status_code.Fail_Status,message:'old passwoed incorrect'})
    }else{
        const hash_password = await bcrypt.hash(new_password,10)
        // await User_schema.updateOne({_id:user_id},{password_hash:hash_password})
        user.password_hash = hash_password;
        await user.save();
        res.status(200).json({status:status_code.Success_Status,message:"changed success"})
    }
})

const forget_password = asyncWrapper(async(req,res) =>{
    const {email} = req.body
    const user = await User_schema.findOne({email:email})
    if(!user){
        res.status(404).json({status:status_code.Fail_Status,message:`this email not match :${email}`})
    }else{
    const reset_code = Math.floor(100000+Math.random()*90000).toString()
    const hash_reset_code = await encrypt(reset_code)
    user.password_reset_code = hash_reset_code
    user.password_reset_expire = Date.now() + 10 * 60 * 1000
    user.psssword_reset_verify = false 
    await user.save()
    await send_Email({email:email,subject:'reset Password',message:`reset code is ${reset_code}`})
    res.status(200).json({status:status_code.Success_Status,message:'reset code is sent'})
    }
})

const reset_code = asyncWrapper(async (req,res) => {
    const {reset_code} = req.body
    const hash_reset_code = await encrypt(reset_code)    
    const user = await User_schema.findOne({password_reset_code:hash_reset_code,password_reset_expire:{$gt:Date.now()}})
    if(!user){
        res.status(404).json({status:status_code.Fail_Status,message:'code not match'})
    }else{
        user.psssword_reset_verify = true
        await user.save()
        res.status(200).json({status:status_code.Success_Status,message:'verifyed true'})
    }
})

const reset_password = asyncWrapper(async (req,res) => {
    const {new_password,email} = req.body
    const user = await User_schema.findOne({email:email})
    if(!user){
        res.status(404).json({status:status_code.Fail_Status,message:'code not match'})
    }
    if(!user.psssword_reset_verify){
        res.status(404).json({status:status_code.Fail_Status,message:'not verify'})
    }else{
        const hash_password = await bcrypt.hash(new_password,10)
        user.password_hash = hash_password
        user.password_reset_code = undefined
        user.password_reset_expire = undefined
        user.psssword_reset_verify = undefined
        await user.save()
        res.status(200).json({status:status_code.Success_Status,message:'password Changed successfuly'})
    }
})

module.exports = {
    login, //
    logout, 
    change_password,
    forget_password,
    reset_code,
    reset_password,
    }