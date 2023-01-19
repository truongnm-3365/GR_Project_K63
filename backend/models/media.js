const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    videos: [{ type: String }],

    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = Media = mongoose.model("Media", MediaSchema);
