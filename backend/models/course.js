const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter course name'],
        trim: true,
        maxLength: [100, 'Course name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter course price'],
        maxLength: [5, 'Course name cannot exceed 5 characters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter course description'],
    },
    ratings: {
        type: Number,
        default: 0
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
    category: {
        type: String,
        required: [true, 'Please select category for this course'],
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

    accepted:{
        type:Boolean,
        default:false
    },

    startDate:{
        type:Date
    },
    
    endDate:{
        type:Date
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Course', courseSchema);