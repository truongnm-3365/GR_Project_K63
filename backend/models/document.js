const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    docs: [{ type: String }],

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true
    },
    topic: {
      type: String,
      required: true,
    }

  },
  {
    timestamps: true,
  }
);

module.exports = Document = mongoose.model("Document", DocumentSchema);
