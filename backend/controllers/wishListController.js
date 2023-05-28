const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const WishList = require('../models/wishList')


exports.addWishList = catchAsyncErrors(async(req,res,next)=>{
    req.body.user = req.user.id
    req.body.course = req.params.id

    const course = await WishList.create(req.body)

    res.status(201).json({
        success: true,
        course
    })
})


exports.getWishList = catchAsyncErrors(async(req, res, next) =>{
    const courses = await WishList.find({user: req.user.id}).populate('course')

    res.status(201).json({
        success: true,
        courses
    })
})

exports.deleteWishList = catchAsyncErrors(async(req, res, next) =>{
    
    const course = await WishList.findById(req.params.id);

    

    if (!course) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy khóa học"
        })
       
    }else{


        await course.remove();

        res.status(200).json({
            success: true,
            message: 'Đã xóa khỏi danh sách yêu thích'
        })
    }
})