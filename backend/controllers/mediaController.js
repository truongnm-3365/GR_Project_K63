const Media = require("../models/media");
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const fs = require('fs');
const Topic = require("../models/topic");
const RegisterCourse = require("../models/registerCourse");


exports.getAll = async (req, res, next) => {
  
    const mediasTmp = await Media.find({course: req.params.courseId});
    const topics = await Topic.find({courseId: req.params.courseId});

    var media = [];
    topics.forEach(item => {
      let medias = mediasTmp.filter(e => e.topicId.toString() === item._id.toString())
      medias.forEach(item => {
        media.push(item);
      })
    });


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
  const { name, courseId, topicId } = req.body;
  
  let videosPaths = [];

  if (Array.isArray(req.files.videos) && req.files.videos.length > 0) {
    for (let video of req.files.videos) {
      videosPaths.push("/" + video.path);
    }
  }
  const topic = await Topic.findById(topicId)

    const createdMedia = await Media.create({
      name,
      videos: videosPaths,
      course: courseId,
      topicId,
      topic:topic.name
    });

    res.status(201).json({ 
      success: true, 
      createdMedia 
    });
});


exports.update = catchAsyncErrors(async (req, res, next) => {
  const { name, topicId } = req.body;

  let media = await Media.findById(req.params.id);

  if (!media) {
    res.status(404).json({
      success: false,
      message:"Không tìm thấy video"
  })
     
  }


  const topic = await Topic.findById(topicId)

  let videosPaths = [];

  if (Array.isArray(req.files.videos) && req.files.videos.length > 0) {
    for (let video of req.files.videos) {
      videosPaths.push("/" + video.path);
    }
    fs.unlink("../backend" + media.videos[0], (err => {
      if (err) console.log(err);
    }));

    media = await Media.findByIdAndUpdate(req.params.id, {
      name,
      videos: videosPaths,
      topicId,
      topic:topic.name
    }, {
      new: true,
      runValidators: true,
      useFindAndModify: false
  });
  }else{
    media = await Media.findByIdAndUpdate(req.params.id, {
      name,
      topicId,
      topic:topic.name
    }, {
      new: true,
      runValidators: true,
      useFindAndModify: false
  });
  }
  


    res.status(201).json({ 
      success: true, 
      media 
    });
});

exports.delete = catchAsyncErrors(async (req, res, next) => {
  const media = await Media.findById(req.params.id);

  if (!media) {
    res.status(404).json({
        success: false,
        message:"Không tìm thấy video"
    })
      
  }

  await media.remove();
  fs.unlink("../backend" + media.videos[0], (err => {
    if (err) console.log(err);

  }));

  

  res.status(200).json({
      success: true,
      message: 'Media is deleted.'
  })
});
