const mongoose = require('mongoose')

const registerCourseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.ObjectId,
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
        type: mongoose.Schema.ObjectId,
        ref: 'Topic',
    },
    media: {
        type: mongoose.Schema.ObjectId,
        ref: 'Media',
    },
    completed: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model('RegisterCourse',registerCourseSchema)