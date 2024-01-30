const {CronJob} = require("cron")
const {weeklyEmail} = require("../services/weekEmail")
const Content = require("../model/ContentModel")
const Alert = require("../model/alertModel")

//*/2 * * * *
//running cron for sending weekly attendance mail
const cron = new CronJob("0 30 8 * * 1",async()=>{
    const content = await Content.find()
    const alerts = await Alert.find()
    let filteredContent = content.filter((c)=>c.content==='Mail of Weekly Attendance Report').forEach(content=> {
    const filteredAlert = alerts.filter(alert =>alert.events.includes(content.eventType))
        filteredAlert.forEach((alert)=>{
            console.log("Weekly",alert.email);
            weeklyEmail(alert.email) 
   })
   })   
})

module.exports = cron  