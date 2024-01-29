const mongoose = require("mongoose")

const AlertSchema = new mongoose.Schema({
    alertId : {
        type : Number,
    },
    email : {
        type : String,
        required : true
    },
    events : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "events"
    }],
    contents : {
        type : String
    }
}, {versionKey : false , timestamps : true})

module.exports = new mongoose.model("Alerts",AlertSchema)

