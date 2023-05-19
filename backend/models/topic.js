const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },

    isFinalTest:{
        type: Boolean,
        default: false
    },
    
    isPassed:{
        type: Boolean,
        default: false
    },

    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },


    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = Topic = mongoose.model('Topic', topicSchema);