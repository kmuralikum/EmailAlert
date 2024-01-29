const nodemailer = require("nodemailer")
const ejs = require("ejs")
const axios = require("axios")


async function weeklyEmail(email){

    const webApiUrl = 'https://fusion-api.thereciprocalsolutions.com/stats/range?start=2024-1-15&end=2024-1-22&branchId=CBE001-3167884895&force=false'
    const Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnREYXRhIjp7ImlkIjo2LCJ0ZW5hbnROYW1lIjoiNWstY2FyLWNhcmUiLCJlbWFpbCI6IjVrQGdtYWlsLmNvbSIsImJpbGxpbmdJbmZvcm1hdGlvbiI6Im5vcm1hbCIsInBsYW5EZXRhaWxzIjp7InZhbGlkaXR5IjoiMTgtMDItMjAyNSIsImNob3NlblBsYW4iOiJiYXNpYyJ9fSwiYnJhbmNoRGF0YSI6eyJpZCI6MSwiYnJhbmNoSWQiOiJDQkUwMDEtMzE2Nzg4NDg5NSIsImJyYW5jaE5hbWUiOiJDQkUwMDEiLCJ0ZW5hbnRJZCI6NiwibG9jYXRpb25EYXRhIjoiQ29pbWJhdG9yZSIsImFkZHJlc3MiOiIxLzIsIFNOUywgQ29pbWJhdG9yZSIsIm1haWwiOltdLCJjcmVhdGVkQXQiOiIyMDIzLTEyLTI1VDE0OjE3OjA0Ljc0OFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTEyLTI1VDE0OjE3OjA0Ljc0OFoifSwiaWF0IjoxNzA1MDQ0NzU2fQ.51R75GmIA1aYxQbphKDn1Tawn9zc411rIfwl4GgNCtk'
    const response = await axios.get(webApiUrl,{headers : {
        "Content-Type" :" application/json; charset=utf-8",
        "Authorization":`Bearer ${Token}`
    }})

    console.log(response.data.rangeStats);

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
        subject : "Weekly Attendance Mail",
        text : "Weekly attendance report",
        html : await ejs.renderFile("./views/weekAttendance.ejs",{
            stats:response.data.rangeStats
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

module.exports = {weeklyEmail}