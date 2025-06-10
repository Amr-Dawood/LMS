const status_code = require('../utils/httpStatus')

module.exports = (...roles) => {
    return (req,res,next) => {
        console.log(req.user.role);
        
        if(roles.includes(req.user.role)){ //condtion for check if not include in array
            // return next(res.status(401).json({status: status_code.Success_Status ,message : 'hello in page'}))
            return next()
        }
        
        return res.status(401).json({status: status_code.Fail_Status ,message : 'unauthorize access'})

    }
}