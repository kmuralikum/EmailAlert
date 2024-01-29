const nodemailer = require("nodemailer")
const ejs = require("ejs")
require("dotenv").config()


async function checkOutEmail(email,name,type,time){
          
        const transporter = nodemailer.createTransport({
            service : "gmail",
            host : "smtp.gmail.com",
            port : 465,
            secure : true,
            auth : {
                user : process.env.USER,
                pass : process.env.APP_PASSWORD
            }
        })
    
        const mailOptions = {
            from : {
                name : 'Murali',
                address : process.env.USER
            },
            to : email,
            subject : "CheckOut Mail",
            text : "CheckOut Mail",
            html : await ejs.renderFile("views/checkInAndOut.ejs",{
                name:name,
                type:type,
                time:time
            })
        }
    
        transporter.sendMail(mailOptions,(err, info)=>{
            if(err){
                console.log(err);
            }else{
                console.log("Email Sent" + info.response);
            }
        })
    }



module.exports = {checkOutEmail}