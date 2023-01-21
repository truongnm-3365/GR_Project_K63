const Media = require("../models/media");
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const fs = require('fs');

exports.getAll = async (req, res, next) => {
  
    const media = await Media.find({course: req.params.courseId});
    res.status(201).json({
      success: true,
      media
  });
};

exports.getLesson = async (req, res, next) => {
  
  const medias = await Media.find({course: req.params.courseId});
  const media = medias[req.params.index];
    res.status(201).json({
      success: true,
      media
  });
};

exports.create = catchAsyncErrors(async (req, res, next) => {
  const { name, courseId } = req.body;
  let videosPaths = [];

  if (Array.isArray(req.files.videos) && req.files.videos.length > 0) {
    for (let video of req.files.videos) {
      videosPaths.push("/" + video.path);
    }
  }

    const createdMedia = await Media.create({
      name,
      videos: videosPaths,
      course: courseId
    });

    res.status(201).json({ 
      success: true, 
      createdMedia 
    });
});

exports.delete = catchAsyncErrors(async (req, res, next) => {
  const media = await Media.findById(req.params.id);

  if (!media) {
      return next(new ErrorHandler('Media not found', 404));
  }

  await media.remove();
  fs.unlink("../backend" + media.videos[0], (err => {
    if (err) console.log(err);
    else {
      console.log("\nDeleled file succesffully");
    }
  }));

  res.status(200).json({
      success: true,
      message: 'Media is deleted.'
  })
});
