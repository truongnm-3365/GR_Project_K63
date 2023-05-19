const mongoose = require('mongoose')

const registerCourseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    name: {
        type: String,
        trim: true,
        maxLength: [100, 'Course name cannot exceed 100 characters']
    },
    images: [
        {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            },
        }
    ],
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
    },
    media: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
    },
    completed: {
        type: Boolean,
        default: false
    },

    timeLimit:{
        type: Number
    },

    createdAt: {
        type:Date
    }

})

module.exports = mongoose.model('RegisterCourse',registerCourseSchema)