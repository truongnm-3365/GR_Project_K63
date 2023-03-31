const Banner = require('../models/banner');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const fs = require('fs');
exports.newBanner = catchAsyncErrors(async (req, res, next) => {

    let imagesLinks = [];

    if (Array.isArray(req.files.images) && req.files.images.length > 0) {
      for (let image of req.files.images) {
          imagesLinks.push({
                  public_id: Date.now(),
                  url: "/" + image.path
           })
      }
    }
  
  
    req.body.images = imagesLinks;

    const banner = await Banner.create(req.body);

    res.status(201).json({
        success: true,
        banner
    })
})



exports.getBanners = catchAsyncErrors(async (req, res, next) => {

    const banners = await Banner.find();

    res.status(200).json({
        success: true,
        banners
    })

})

exports.getBanner = catchAsyncErrors(async (req, res, next) => {

    const banner = await Banner.findById(req.params.id);
    if (!banner) {
        return next(new ErrorHandler('Banner not found', 404));
    }

    res.status(200).json({
        success: true,
        banner
    })

})

exports.updateBanner = catchAsyncErrors(async (req, res, next) => {

    let banner = await Banner.findById(req.params.id);

    if (!banner) {
        return next(new ErrorHandler('Banner not found', 404));
    }

    let imagesLinks = [];

    if (Array.isArray(req.files.images) && req.files.images.length > 0) {
        for (let i = 0; i < banner.images.length; i++) {
            fs.unlink("../backend" + banner.images[i].url, (err => {
                if (err) console.log(err);
                else {
                  console.log("\nDeleled file succesffully");
                }
            }));
        }
        for (let image of req.files.images) {
            imagesLinks.push({
                    public_id: Date.now(),
                    url: "/" + image.path
            })
        }
        req.body.images = imagesLinks
    }
    

    banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        banner
    })

})

exports.deleteBanner = catchAsyncErrors(async (req, res, next) => {

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
        return next(new ErrorHandler('Banner not found', 404));
    }

    for (let i = 0; i < banner.images.length; i++) {
       
        fs.unlink("../backend" + banner.images[i].url, (err => {
            if (err) console.log(err);
        }));
    }

    await Banner.remove();

    res.status(200).json({
        success: true,
        message: 'Banner is deleted.'
    })

})