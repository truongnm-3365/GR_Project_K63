const mongoose = require('mongoose')

const notifySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },

    content:{
        type:String,
        require: true
    },

    course:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Course",
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