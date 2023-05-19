const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
    question:{
        type:String,
        require: true
    },

    choice:[{
        body:{
            type:String,
            require: true
        },

        isCorrect:{
            type:Boolean,
            default:false,
            require:true
        }

    }],

    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },



    
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = Quiz = mongoose.model('Quiz', quizSchema);