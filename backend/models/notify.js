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

    course:{
        type: String,
    },
    
    type:{
        type: Number,     // 0 :Thông báo nhận được phê duyệt
        default: 0        // 1 :Thông báo cho tin nhắn
    },                    // 2 :Thông báo cộng điểm
    
    createdAt: {
        type: Date,
        default: Date.now
    }


})

module.exports = Notify = mongoose.model('Notify', notifySchema);