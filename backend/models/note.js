const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
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

    body:{
        type: String,
        require: true
    },

    media: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
        require:true
    },

    time:{
        type: Number,
        require:true
    }

})

module.exports = mongoose.model('Note',noteSchema)