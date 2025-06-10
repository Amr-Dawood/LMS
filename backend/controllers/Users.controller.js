// {status: "success" ,data: {adduser}} //standard for resbonse in project
const User_schema = require('../models/users.model')
const {validationResult} = require('express-validator')
const status_code = require('../utils/httpStatus')
const bcrypt = require('bcrypt')
require('dotenv').config()
const CJWT = require('../utils/createJWT')
const asyncWrapper = require('../middlewares/asyncWrapper')
const passwordValidator = require('password-validator'); // Correct import

const passwordSchema = new passwordValidator(); // This should be PascalCase (PasswordValidator)

passwordSchema
    .is().min(8)            // Minimum length 8
    .is().max(32)           // Maximum length 32
    .has().uppercase()      // Must have uppercase letters
    .has().lowercase()      // Must have lowercase letters
    .has().digits(2)        // Must have at least 2 digits
    .has().symbols()        // Must have at least 1 special character
    .has().not().spaces();  // No spaces allowed

const Get_users = async (req,res)=>{
    const query = req.query
    const limit = query.limit || 2
    const page = query.page || 1
    const skip = (page - 1 ) * limit
    
    // console.log(req.params
    const users = await User_schema.find({},{"__v": false}).limit(limit).skip(skip)
    try{
        if(users.length == 0){
            res.status(200).json({status: status_code.Fail_Status ,message: 'There are no users'})
        }else{
            res.status(200).json({
                num_user:users.length,
                users:users
            })
        }
    }catch(err){
        res.status(400).json({status: status_code.Error_Status ,message:err})
    }
}

const Get_single_User = asyncWrapper(async (req,res) => {

    
    // if (!mongoose.Types.ObjectId.isValid(req.params.user)) {
        //     return res.status(400).json({ status: status_code.Fail_Status, message: "Invalid user ID format" });
            // }

            const getuser = await User_schema.findOne({_id:req.user._id})
            console.log(getuser);
            
            if(!getuser){
                res.status(400).json({status: status_code.Fail_Status ,message:'user not found'})
            }else{
                res.status(200).json({status: status_code.Success_Status ,data:getuser})
            }
            
        //     try{
        // }catch(err){
        //     res.status(500).json({status: status_code.Error_Status ,message:err.message})
        // }
})

const Adduser = async (req,res,next) => {   

        try{
            const{first_name,last_name,phone_number,gender,age,username,email,password_hash,role,created_at} = req.body;
            console.log(req.body);
            
            // console.log("req.file-->",req.file);
            
            const mail = await User_schema.findOne({email: email})
            if(mail){
                return res.status(400).json({status: status_code.Fail_Status ,message: 'user already exist'})
            }

            if (!passwordSchema.validate(password_hash)) {
                return res.status(400).json({ 
                    message: 'Password must be 8-32 characters long, contain at least 1 uppercase letter, 2 digits, and 1 special character.' 
                });
            }
            // hash password
            const hash_password = await bcrypt.hash(password_hash,10)
            console.log('mazen');
            
            const adduser = new User_schema({
                first_name,
                last_name,
                phone_number,
                gender,
                age,
                username,
                email,
                password_hash: hash_password,
                role,
                created_at,
                // token,
                // avatar: req.file.filename
            })
            // genrate JWT
            // const unique =  await CJWT({email:adduser.email,id:adduser._id,role:adduser.role})
            // adduser.token = unique
            console.log('mazen');

            await adduser.save()
            res.json({status: status_code.Success_Status ,data: {adduser}})

        }catch(err){
            return res.status(400).json({status: status_code.Error_Status ,data: err})
        }
    }

const deluser = async (req,res) => {
        
    try{
        
        // if (!mongoose.Types.ObjectId.isValid(req.params.user)) {
        //     return res.status(400).json({ status: status_code.Fail_Status, message: "Invalid user ID format" });
        // }
        const getuser = await User_schema.findOne({_id:req.params.user})
        if(!getuser){
            res.status(400).json({status: status_code.Fail_Status ,message:'user not found'})
        }else{
            const deluser = await User_schema.deleteOne({_id:req.params.user})
            res.status(200).json({status: status_code.Success_Status ,data:deluser})
        }
    }catch(err){
        res.status(500).json({status: status_code.Error_Status ,message:err.message})
    }
}    

const update_user = async (req,res) => {
    try{
        
        // if (!mongoose.Types.ObjectId.isValid(req.params.user)) {
            //     return res.status(400).json({ status: status_code.Fail_Status, message: "Invalid user ID format" });
            // }
            const getuser = await User_schema.findOne({_id:req.params.user})
            if(!getuser){
                res.status(400).json({status: status_code.Fail_Status ,message:'user not found'})
            }else{
                const UBdate_user = await User_schema.updateOne({_id:req.params.user},{$set: {...req.body}})
            res.status(200).json({status: status_code.Success_Status ,data:UBdate_user})
        }
    }catch(err){
        res.status(500).json({status: status_code.Error_Status ,message:err.message})
    }
}

const get_all_instructor = asyncWrapper (async (req,res) => {
    const instructors = await User_schema.find({role:'instructor'})
    if (!instructors){
        res.status(404).json({status:status_code.Fail_Status,message:'no instructor'})
    }else{
        res.status(200).json({status:status_code.Success_Status,message:{instructors_num:instructors.length,message:"this all instructor",data:instructors}})
    }
})

const user_profile = asyncWrapper (async (req,res) => {
        const user_id = req.user.id
        const user_profile = await User_schema.findById(user_id)
        if(!user_profile){
            res.status(404).json({status:status_code.Fail_Status,message:"user Not Found"})
        }else{
            res.status(200).json({status:status_code.Success_Status,data:{user_profile:user_profile}})
        }
})

const auth_me = asyncWrapper (async (req,res) =>{
    const id = req.user._id
    const user = await User_schema.findById(id)
    res.json({ success: true, user });
})



    module.exports = {
    Get_users, 
    Adduser, //
    Get_single_User, 
    deluser,
    update_user,
    get_all_instructor,
    user_profile,
    auth_me
    }    