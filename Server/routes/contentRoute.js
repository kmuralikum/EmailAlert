const router = require("express").Router()
const Content = require("../model/ContentModel")
const Alert = require("../model/alertModel")
const Events = require("../model/eventModel")


/**
 * @desc    Creating a content
 * @route   POST /api/v1/contents/
 * @access  Public 
 */
router.post("/",async(req,res)=>{
    try{
        const {eventType , content} = req.body

        const newContent = await Content.create({
        eventType,
        content,
    })

    if(newContent){
            res.status(201).json({success: true , msg : "Content created",newContent})
        }else{
            res.status(500).json({success: false , msg :"Content cannot be created"})
        }

    }catch(err){
        console.error("Internal server Eror",err);
    }
})


/**
 * @desc    update the Content by id
 * @route   PUT /api/v1/contents/:id
 * @access  Public
 */
router.put("/:id",async(req,res)=>{
    try{
        const id = req.params.id
     
        const UpdateContent = await Content.findByIdAndUpdate({_id:id},{
            content : req.body.content
        },{new:true})
        
        if(UpdateContent){ 

            return res.status(200).json({success : true , msg :"updated Succesfully" , UpdateContent})    
        }
        res.status(400).json({success:false,msg:"updation failed"})
    
    }catch(error){
        console.error("Internal Server error",error);
    }
})


/**
 * @desc    Getting all content
 * @route   POST /api/v1/contents/
 * @access  Public
 */
router.get("/",async(req,res)=>{
    try{
        const getAllContents = await Content.find()
    
        if(getAllContents){
            res.status(200).json({success : true , Events : getAllContents})
        }else{
            res.status(500).json({success:false, msg: "Cannot get Content"})
        }
    }catch(error){
        console.error("Internal Server Error",error);
    }
})


/**
 * @desc    Getting content by Id
 * @route   POST /api/v1/contents/:id
 * @access  Public
 */
router.get("/:id",async(req,res)=>{
    try{
        const id= req.params.id
        const getContent = await Content.find({_id:id})
    
        if(getContent){
            console.log(getContent[0].content);
            res.status(200).json({success : true , Events : getContent})
        }else{
            res.status(500).json({success:false, msg: "Cannot get Content"})
        }
    }catch(error){
        console.error("Internal Server Error",error);
    }
})

module.exports = router

































