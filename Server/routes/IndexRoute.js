const router = require("express").Router()
const Event = require("../model/eventModel")


//Rendering a form
router.get("/",async(req,res)=>{
    const Events = await Event.find()
    res.render("index",{Events})
})

module.exports = router