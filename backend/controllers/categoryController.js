const Category = require('../models/category');
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

    res.status(200).json({
        success: true,
        categories
    })

})

exports.getCategory = catchAsyncErrors(async (req, res, next) => {

    const category = await Category.findById(req.params.id);
    if (!category) {
        return next(new ErrorHandler('Category not found', 404));
    }

    res.status(200).json({
        success: true,
        category
    })

})

exports.updateCategory = catchAsyncErrors(async (req, res, next) => {

    let category = await Category.findById(req.params.id);

    if (!category) {
        return next(new ErrorHandler('Category not found', 404));
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
        return next(new ErrorHandler('Category not found', 404));
    }


    await category.remove();

    res.status(200).json({
        success: true,
        message: 'Category is deleted.'
    })

})