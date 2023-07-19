const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const Follow = require('../models/follow');


exports.addFollow = catchAsyncErrors(async(req,res,next)=>{
    req.body.follower = req.user.id
    req.body.user = req.params.id
    
    const follow = await Follow.create(req.body)

    res.status(201).json({
        success: true,
        follow
    })
})


exports.getFollowingList = catchAsyncErrors(async(req, res, next) =>{
    const followings = await Follow.find({follower: req.params.id}).populate('user')

    res.status(201).json({
        success: true,
        followings
    })
})


exports.getFollowList = catchAsyncErrors(async(req, res, next) =>{
    const followers = await Follow.find({user: req.params.id}).populate('follower')

    res.status(201).json({
        success: true,
        followers
    })
})

exports.deleteFollow = catchAsyncErrors(async(req, res, next) =>{
    
    const follow = await Follow.findOne({follower: req.user.id, user: req.params.id});

    if (!follow) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy theo dõi"
        })
       
    }else{


        await follow.remove();

        res.status(200).json({
            success: true,
            message: 'Đã hủy bỏ theo dõi'
        })
    }
})