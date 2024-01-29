const router = require("express").Router()
const Alert = require("../model/alertModel")
const emailQueue = require("../queues/Emailqueue")
const Events = require("../model/eventModel")
const Content = require("../model/ContentModel")


/**
 * @desc    Creating an alert
 * @route   POST /api/v1/alert/
 * @access  Public
 */
router.post("/",async(req,res)=>{
    try{
        // Process and save the alert data to MongoDB
        const get = await Alert.find()
        const {alertId , email , events} = req.body

        //checking whether events is an array 
        const selectedEvents = Array.isArray(events) ? events : [events]

        //Mapping each events to get the content from Content Db
        const selectedEvent = selectedEvents.map((event)=>Events.findOne({events : event}).select("_id").exec())
        const eventId = await Promise.all(selectedEvent)

        //Enqueue email jobs for each selected event
        const alert = new Alert({
            alertId : alertId || get.length + 1,
            email, 
            events : eventId,
        })  
        await alert.save()
        console.log(`Alert added and email job enqueued for the Selected Events`, alert);
        res.redirect("/api/v1/")
        

        // Enqueue email jobs for each alert
        const alerts = await Alert.find()
         alerts.forEach(async(alertData) => {
            const Events = alertData.events
            const contentPromises = Events.map(data => Content.findOne({eventType : data}).exec())
            const contentResults = await Promise.all(contentPromises)
  
            // console.log(contentResults);
              
            const alertDATA = {
              email : alertData.email, 
              events : alertData.events,
              contents : contentResults
            }
             console.log(alertDATA);
            // adding the alertData and the content to the Queue..
            const job = await emailQueue.add("sendEmail",alertDATA,{attempts: 3,removeOnComplete: true})
              if(job){
                console.log("Email jobs added to the queue:",job.data,job.id);
              }else{
                console.log("queue Empty")
              }
            })
    }catch(error){
        console.log(error);
        res.status(500).send("Internal Server Error") 
    }
})

/**
 * @desc    Get All alerts
 * @route   GET /api/v1/alert/
 * @access  Public
 */
router.get("/",async (req,res)=>{

    try{
        const getAllAlerts = await Alert.find().populate('events')
    
        if(getAllAlerts){
            res.status(200).json({success : true ,Alerts : getAllAlerts })
        }else{
            res.status(500).json({success : false , msg : "Cannot get Alerts"})
        }
    }catch(error){
        console.error("Internal Server Error", error);
    }
})



/**
 * @desc    Get an alert By Id
 * @route   GET /api/v1/alert/:id  
 * @access  Public
 */
router.get("/:id",async(req,res)=>{
    try{
        const id = req.params.id
        const getAlert = await Alert.findById({_id : id}).populate('events')
    
        if(getAlert){
            res.status(200).json({success : true ,Alert : getAlert })
        }else{
            res.status(500).json({success : false , msg : "Cannot get Alerts"})
        }
    }catch(error){
        console.error("Internal Server Error:", error);
    }
})


module.exports = router