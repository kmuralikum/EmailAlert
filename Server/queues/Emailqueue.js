const Queue = require("bull")
require("dotenv").config()


// Create a Bull queue for email jobs
const emailQueue = new Queue("emailQueue",{
    limiter : {max : 10 , duration : 1000},
    defaultJobOptions : {
        removeOnComplete : true,
        removeOnFail : 5
    }, 
    redis :{
        host : 'localhost',
        port : 6379,
        stalledInterval: 0,
        maxRetriesPerRequest: null, 
        enableReadyCheck: false
    },
})

module.exports = emailQueue