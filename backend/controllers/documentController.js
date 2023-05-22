const Document = require("../models/document");
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const fs = require('fs');
const Topic = require("../models/topic");

exports.getAll = async (req, res, next) => {
  
    let documents = await Document.find({course:req.params.courseId});
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
      res.status(404).json({
          success: false,
          message:"Không tìm thấy tài liệu"
      })
      
  }

  await document.remove();
  fs.unlink("../backend" + document.docs[0], (err => {
    if (err) console.log(err);
  }));

  res.status(200).json({
      success: true,
      message: 'document is deleted.'
  })
});
