const User = require('../models/user');
const fs = require('fs');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const Course = require('../models/course')
const RegisterCourse = require('../models/registerCourse');
const crypto = require('crypto');
const mongoose = require("mongoose");

// Register a user   => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    let avatarPaths = [];

  if (Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
    for (let avatar of req.files.avatar) {
      avatarPaths.push("/" + avatar.path);
    }
  }
    

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: Date.now(),
            url: avatarPaths[0]
        }
    })



    sendToken(user, 200, res)

})

// Login User  =>  /a[i/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // Finding user in database
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res)
})

// Forgot Password   =>  /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset password url
    const resetUrl = `${req.protocol}://localhost:3000/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try {

        await sendEmail({
            email: user.email,
            subject: 'Online Course Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email đã được gửi tới: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500))
    }

})

// Reset Password   =>  /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)

})


// Get currently logged in user details   =>   /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    let user = await User.findById(req.user.id);
    const courses = await Course.find({user: req.user.id,accepted: true});

    user = {courses,...user._doc}

    res.status(200).json({
        success: true,
        user
    })
})


exports.getPublicUserProfile = catchAsyncErrors(async (req, res, next) => {
    let user = await User.findById(req.params.id);
    const courses = await Course.find({user: req.params.id,accepted: true});

    user = {courses,...user._doc}

    res.status(200).json({
        success: true,
        profile:user
    })
})


// Update / Change password   =>  /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return next(new ErrorHandler('Old password is incorrect'));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res)

})


// Update user profile   =>   /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    const userTmp = await User.findById(req.user.id)
    
    let avatarPaths = [];

    if (Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        fs.unlink("../backend" + userTmp.avatar.url, (err => {
            if (err) console.log(err);
            else {
              console.log("\nDeleled file succesffully");
            }
        }));
        for (let avatar of req.files.avatar) {
            avatarPaths.push("/" + avatar.path);
        }
        newUserData.avatar = {
            public_id: Date.now(),
            url: avatarPaths[0]
        }
    }


    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})


// Logout user   =>   /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})

// Admin Routes

// Get all users   =>   /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

exports.allUsersChat = catchAsyncErrors(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const registerCourses = await RegisterCourse.find();
 
    const courses = await Course.find({user: req.user.id})
    let myusers = []

    courses.forEach((course) => {
        let users = registerCourses.filter(item => item.course.toString() === course._id.toString())
        users = users.map(item => item.user.toString())
        users = [...new Set(users)]
        myusers.push(...users)
    })

    myusers = [...new Set(myusers)]
    
    myusers = myusers.map(item => mongoose.Types.ObjectId(item))
    
    let myRegister = await RegisterCourse.find({user: req.user.id})
    myRegister = myRegister.map(item => {
        return item.course.toString()
    })
    myRegister = [...new Set(myRegister)]
    myRegister = myRegister.map(item => mongoose.Types.ObjectId(item))
    
    const myRegisterCourses = await Course.find({_id:{ $in: myRegister}})
    myRegister = myRegisterCourses.map(item => item.user)
    myusers.push(...myRegister)
    
    const users = await User.find(keyword).find({ _id: { $ne: req.user.id } }).find({_id:{ $in: myusers}});
    res.send(users);
  });


// Get user details   =>   /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})

// Update user profile   =>   /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

// Delete user   =>   /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    // Remove avatar from cloudinary
    // const image_id = user.avatar.public_id;
    // await cloudinary.v2.uploader.destroy(image_id);

    const image_url = user.avatar.url

    fs.unlink("../backend" + image_url, (err => {
        if (err) console.log(err);
        else {
          console.log("\nDeleled file succesffully");
        }
    }));

    await user.remove();

    res.status(200).json({
        success: true,
    })
})