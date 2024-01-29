const mongoose = require("mongoose")

const Connection = ()=>{
    try{
        const db = mongoose.connect("mongodb+srv://admin:admin@cluster0.rwmduay.mongodb.net/?retryWrites=true&w=majority")
        if(db){
            console.log("Db Connected Succesfully");
        }
    }catch(error){
        console.log(error);
    }
}

module.exports = Connection