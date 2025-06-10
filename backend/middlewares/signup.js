const express = require('express')
const {body} = require('express-validator')

const user_mid = () => {
    return [
        body('usernaem').notEmpty().isLength({min:2}).withMessage("username is requird")
    ]
}

module.exports = {
    user_mid
}