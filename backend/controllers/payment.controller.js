    // {status: "success" ,data: {adduser}} //standard for resbonse in project
    const course_schema = require('../models/courses.model')
    const {validationResult} = require('express-validator')
    const status_code = require('../utils/httpStatus')
    const bcrypt = require('bcrypt')
    require('dotenv').config()
    const CJWT = require('../utils/createJWT')
    const asyncWrapper = require('../middlewares/asyncWrapper')
    const User_schema = require('../models/users.model')
    const enroll_schema = require('../models/enrollment.model')
    const User = require('../models/users.model');
    const Course = require('../models/courses.model');
    const Purchase_schema = require('../models/purches.model')
    const stripe = require('stripe')

const purches_course = asyncWrapper (async (req,res) =>{
    const {course_id} = req.params
    const {origin} = req.headers
    const user_id = req.user.id
    // console.log(course_id);
    // console.log(origin);
    // console.log(user_id);

    
    console.log(1);
    
    const course = await course_schema.findById(course_id)
    const user = await User_schema.findById(user_id)
    if(!course || !user){
        res.status(403).json({status:status_code.Fail_Status,message:'this Data not found'})
    }
    // console.log(course);
    // console.log(user);
    
    console.log(1);
    const PAY = new Purchase_schema({
        course_Id:course_id,
        user_Id:user_id,
        amount:course.course_price,
        // status:'pending',
    })
    console.log(1);

                await PAY.save()

                const stripeinstence = new stripe(process.env.stripe_Secret_key)
                currency = process.env.currency.toLowerCase()
                console.log(1);

                const line_items = [{
                    price_data:{
                        currency,
                        product_data:{
                            name: course.title,
                            description: course.description

                        },
                        unit_amount: Math.floor(PAY.amount)*100,
                    },
                    quantity: 1 ,
                }]
                console.log(1);

                const session = await stripeinstence.checkout.sessions.create({
                    success_url: `${origin}/course-list`,
                    cancel_url: `${origin}/`, 
                    line_items:line_items,
                    mode: 'payment',
                    metadata:{
                        PurchaseId: PAY._id.toString()
                    }
                })
                console.log(1);

                res.json({status:status_code.Success_Status,message:session.url})

})


module.exports = {
    purches_course,

}