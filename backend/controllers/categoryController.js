const Category = require('../models/category');
const Course = require('../models/course');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

exports.newCategory = catchAsyncErrors(async (req, res, next) => {

    const category = await Category.create(req.body);


    res.status(201).json({
        success: true,
        category
    })
})





exports.getCategories = catchAsyncErrors(async (req, res, next) => {

    const categories = await Category.find();

    const courses = await Course.find();

    let categoriesTmp = []

    for(let cate of categories){
        let numCourses = 0
        for(let course of courses){
            if(cate.name === course.category){
                numCourses = numCourses + 1;
            }
        }
        
        cate._doc.numCourses = numCourses;
        categoriesTmp.push(cate)
    }


    res.status(200).json({
        success: true,
        categories:categoriesTmp
    })

})

exports.getCategory = catchAsyncErrors(async (req, res, next) => {

    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404).json({
            success: false,
            message:'Không tìm thấy danh mục'
        })
       
    }

    res.status(200).json({
        success: true,
        category
    })

})

exports.updateCategory = catchAsyncErrors(async (req, res, next) => {

    let category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404).json({
            success: false,
            message:'Không tìm thấy danh mục'
        })
       
    }
    

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        category
    })

})

exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {

    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404).json({
            success: false,
            message:'Không tìm thấy danh mục'
        })
       
    }


    await category.remove();

    res.status(200).json({
        success: true,
        message: 'Category is deleted.'
    })

})