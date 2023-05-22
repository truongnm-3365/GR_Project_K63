const Notify = require('../models/notify');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const mongoose = require('mongoose')

const User = require('../models/user');
//const ObjectID = require('mongodb').ObjectID
exports.getMeNotifies = catchAsyncErrors(async (req, res, next) => {

    const notifies = await Notify.find({user: req.user._id});
    

    if (!notifies) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy thông báo"
        })
       
    }

    res.status(200).json({
        success: true,
        notifies
    })

})

exports.deleteAllNotifies = catchAsyncErrors(async (req, res, next) => {

    const notifies = await Notify.deleteMany({user: req.params.userId,type: { $ne: 1 } });

    if (!notifies) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy thông báo"
        })
      
    }


    res.status(200).json({
        success: true,
        message: 'Deleted successfully'
    })

})

exports.deleteAllNotifiesMessage = catchAsyncErrors(async (req, res, next) => {

    const notifies = await Notify.deleteMany({user: req.params.userId,type:1});

    if (!notifies) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy thông báo"
        })
        
    }


    res.status(200).json({
        success: true,
        message: 'Deleted successfully'
    })

})