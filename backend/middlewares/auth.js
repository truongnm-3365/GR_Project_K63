const User = require('../models/user')

const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const Course = require('../models/course');



// Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
 
    const token = req.header('Authorization');
    
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Login first to access this resource.'
        })
        //return next(new ErrorHandler('Login first to access this resource.', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const courses = await Course.find({user: decoded.id,accepted: true});
    let user = await User.findById(decoded.id);
    
    user._doc.courses = courses    

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