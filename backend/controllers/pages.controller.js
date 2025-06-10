const User_schema = require('../models/users.model')
const {validationResult} = require('express-validator')
const status_code = require('../utils/httpStatus')
const bcrypt = require('bcrypt')
require('dotenv').config()
const CJWT = require('../utils/createJWT')
const path = require('path')


const Login_Page = (req,res)=>{
    res.sendFile(path.join(__dirname, '../client/login.html'));

}
const Dashboard_page = (req,res)=>{
    res.sendFile(path.join(__dirname, '../client/dashboard.html'));
}


module.exports = {
    Login_Page,
    Dashboard_page
}