const mongoose = require('mongoose')

const notifySchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },

    content:{
        type:String,
        require: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = Notify = mongoose.model('Notify', notifySchema);