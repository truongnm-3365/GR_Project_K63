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
        required: [true, 'Please enter course name'],
        trim: true,
        maxLength: [100, 'Course name cannot exceed 100 characters']
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],


})

module.exports = mongoose.model('RegisterCourse',registerCourseSchema)