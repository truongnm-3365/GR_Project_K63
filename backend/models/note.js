const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
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

    body:{
        type: String,
        require: true
    },

    media: {
        type: mongoose.Schema.ObjectId,
        ref: 'Media',
        require:true
    },

    time:{
        type: Number,
        require:true
    }

})

module.exports = mongoose.model('Note',noteSchema)