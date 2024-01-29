const mongoose = require("mongoose")
require("dotenv").config()
const URL = process.env.MONGO_URL

const Connection = ()=>{
    try{
        const db = mongoose.connect(URL)
        if(db){
            console.log("Db Connected Succesfully");
        }
    }catch(error){
        console.log(error);
    }
}

module.exports = Connection