const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    events : {
        type : String,
    }
},{versionKey: false , timestamps : true})

module.exports = new mongoose.model("events",eventSchema)
