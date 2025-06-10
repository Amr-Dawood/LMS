const nodemailer = require('nodemailer')
require('dotenv').config()

const send_Email =async (options) => {
    
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user: process.env.Email,
            pass:process.env.Pass_Email
        }
    })

    const mail_optios = {
        from : `"LMS Website" <${process.env.Email}>`,
        to : options.email,
        subject:options.subject,
        text:options.message 
    }
    await transporter.sendMail(mail_optios)
}

module.exports = send_Email