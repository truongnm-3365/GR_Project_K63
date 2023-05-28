const mongoose = require('mongoose')

const wishListSchema = new mongoose.Schema({
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

    createdAt: {
        type:Date
    }

})

module.exports = mongoose.model('wishList',wishListSchema)