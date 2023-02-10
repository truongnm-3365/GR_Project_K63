const Document = require("../models/document");
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const fs = require('fs');
const Topic = require("../models/topic");

exports.getAll = async (req, res, next) => {
  
    let documents = await Document.find({course:req.params.courseId});

    //let documents = docs.find(item => item.course.toString() === req.params.courseId)
    //console.log(JSON.stringify(documents));
    res.status(201).json({
      success: true,
      documents
  });
};

exports.getDocument = async (req, res, next) => {
  
  const documents = await Document.find({course: req.params.courseId});
  const document = documents[req.params.index];
    res.status(201).json({
      success: true,
      document
  });
};

exports.create = catchAsyncErrors(async (req, res, next) => {
  const { name, courseId, topicId} = req.body;
  console.log(req.body);
  let documentsPaths = [];

  if (Array.isArray(req.files.documents) && req.files.documents.length > 0) {
    for (let document of req.files.documents) {
      documentsPaths.push("/" + document.path);
    }
  }
   const topic = await Topic.findById(topicId)

    const document = await Document.create({
      name,
      docs: documentsPaths,
      course: courseId,
      topicId,
      topic:topic.name
    });

    res.status(201).json({ 
      success: true, 
      document 
    });
});

exports.delete = catchAsyncErrors(async (req, res, next) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
      return next(new ErrorHandler('document not found', 404));
  }

  await document.remove();
  fs.unlink("../backend" + document.docs[0], (err => {
    if (err) console.log(err);
    else {
      console.log("\nDeleled file succesffully");
    }
  }));

  res.status(200).json({
      success: true,
      message: 'document is deleted.'
  })
});
