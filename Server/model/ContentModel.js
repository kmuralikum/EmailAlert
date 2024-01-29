const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    eventType : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "eventModel",
        unique: true, 
        required: true 
    },
    content : {
        type : String,
        required : true
    }
},{versionKey:false,timestamps:true})

module.exports = new mongoose.model("Content" , contentSchema)