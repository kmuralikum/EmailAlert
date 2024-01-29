const {CronJob} = require("cron")
const {attndEmail} = require("../services/attndEmail")
const Content = require("../model/ContentModel")
const Alert = require("../model/alertModel")

// 0 30 8 * * * 
const cron = new CronJob("0 30 8 * * 1-5 ",async()=>{  
    const content = await Content.find()
    const alerts = await Alert.find()
    let filteredContent = content.filter((c)=>c.content==='Mail of Daily attendance report').forEach(content=> {
    const filteredAlert = alerts.filter(alert =>alert.events.includes(content.eventType))
    
        filteredAlert.forEach((alert)=>{
            console.log("Daily",alert.email);
            attndEmail(alert.email) 
   })
   })   
}) 

module.exports = cron 