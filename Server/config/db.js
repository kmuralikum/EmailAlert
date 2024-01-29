const mongoose = require("mongoose")

const Connection = ()=>{
    try{
        const db = mongoose.connect("mongodb://0.0.0.0:27017/emailQueue")
        if(db){
            console.log("Db Connected Succesfully");
        }
    }catch(error){
        console.log(error);
    }
}

module.exports = Connection