const User = require('../models/user')

const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");


// Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
 
    const token = req.header('Authorization');
    
    

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Phải thực hiện đăng nhập trước khi truy cập vào đây'
        })
       
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    

    let user = await User.findById(decoded.id);   
    
    req.user = user;

    next()
})

// Handling users roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role (${req.user.role}) is not allowed to acccess this resource`, 403))
        }
        next()
    }
}