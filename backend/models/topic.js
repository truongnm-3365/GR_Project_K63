const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true
    },
    courseId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true
    },


    
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = Topic = mongoose.model('Topic', topicSchema);