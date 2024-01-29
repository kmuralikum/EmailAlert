const router = require("express").Router()
const {checkInEmail} = require("../services/checkInEmail.js")
const {checkOutEmail} = require("../services/checkOutEmail.js")
const Content = require("../model/ContentModel.js")
const Alert = require("../model/alertModel.js")

/**
 * @desc    CheckIn Route
 * @route   POST /api/v1/attendance/checkIn
 * @access  Public
 */
router.post("/checkIn",async(req,res)=>{
    
    const {name,type,time} = req.body
    console.log(name,type,time);
    const content = await Content.find()
    const alerts = await Alert.find()
    let filteredContent = content.filter((c)=>c.content==='CheckIn and CheckOut').forEach(content=> {
    const filteredAlert = alerts.filter(alert =>alert.events.includes(content.eventType))
    if(type=="checked in"){
        filteredAlert.forEach((alert)=>{
            checkInEmail(alert.email,name,type,time);       
    }) 
    return res.status(200).json({Success:true , msg:"Mail sent Successfully"})
    } 
    res.status(400).json({Success:false , msg:"Cannot send mail"})
   })
   
})


/**
 * @desc    CheckOut Route
 * @route   POST /api/v1/attendance/checkOut
 * @access  Public
 */
router.post("/checkOut",async(req,res)=>{
    
    const {name,type,time} = req.body
    // console.log(name,type,time);
    const content = await Content.find()
    const alerts = await Alert.find()
    let filteredContent = content.filter((c)=>c.content==='CheckIn and CheckOut').forEach(content=> {
    const filteredAlert = alerts.filter(alert =>alert.events.includes(content.eventType))
    if(type=="checked out"){
        filteredAlert.forEach((alert)=>{
            checkOutEmail(alert.email,name,type,time);       
    }) 
    }
   })
   res.status(200).json({Success:true , msg:"Mail sent Successfully"})
})

module.exports = router