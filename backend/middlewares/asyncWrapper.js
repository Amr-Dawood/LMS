    const status_code = require('../utils/httpStatus')


module.exports = (asyncfun) => {

    return (req,res,next) =>{
    
        asyncfun(req,res,next).catch((err) => {
            next(res.status(500).json({status:status_code.Error_Status, message:err}))
        })
        
    }
}


// const asyncWrapper = (fn) => {
//     return async (req, res, next) => {
//         try {
//             await fn(req, res, next);
//         } catch (err) {
//             res.status(500).json({ 
//                 status: "error", 
//                 message: err.message || "Internal Server Error" 
//             });
//         }
//     };
// };

// module.exports = asyncWrapper;