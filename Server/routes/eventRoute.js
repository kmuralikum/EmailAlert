const router = require("express").Router()
const Events = require("../model/eventModel")

/**
 * @desc    Creating an Event
 * @route   POST /api/v1/events/
 * @access  Public
 */
router.post("/",async(req,res)=>{
    try{
        const {events} = req.body
    
        const newEvent = await Events.create({
            events
        })
        if(newEvent){
                res.status(201).json({success: true , msg : "Event added Successfully",newEvent})
            }else{
                res.status(500).json({success: false , msg: "Content cannot be created"})
            }

    } catch(error){
        console.error("Internal Server Error",error);
    }
})


/**
 * @desc    Getting all Event
 * @route   POST /api/v1/events/
 * @access  Public
 */
router.get("/",async(req,res)=>{
    try{
        const getAllEvents = await Events.find()
    
        if(getAllEvents){
            res.status(200).json({success : true , Events : getAllEvents})
        }else{
            res.status(500).json({success:false, msg: "Cannot get Events"})
        }
    }catch(error){
        console.error("Internal Server Error",error);
    }
})


/** 
 * @desc    updating all Events
 * @route    POST /api/v1/events/:id
 * @access  Public
*/
router.put("/:id",async(req,res)=>{
    try{
        const id = req.params.id

        const updateEvent = await Events.findByIdAndUpdate({_id:id},{
            events : req.body.events
        },{new:true})

        if(updateEvent){
           return res.status(200).json({success:true,msg : updateEvent})
        }
        res.status(400).json({success: false,msg:"Cannot update Event"})

    }catch(error){
        console.error("Internal Server error",error);
    }
})

module.exports = router