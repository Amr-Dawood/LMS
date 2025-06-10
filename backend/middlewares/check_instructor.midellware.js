const User = require("../models/users.model"); // Import User model
const status_code = require("../utils/httpStatus");
const asyncWrapper = require('./asyncWrapper')
const User_Rules = require('../utils/User_Roles')



const check_instructor = asyncWrapper(async (req, res, next) => {
    
    if (!req.user) {  // Ensure req.User exists
        return res.status(401).json({ 
            status: status_code.Fail_Status, 
            message: "Unauthorized access: User not found" 
        });
    }
    const role = req.user.role
    if(role === User_Rules.INSTRUCTOR){
        // res.status(200).json({status: status_code.Success_Status,message:"authoriztion success"})
        next()
    }else{
        res.status(403).json({status:status_code.Fail_Status,message:"unauthorize access"})
    }
})
module.exports = {
    check_instructor,

}