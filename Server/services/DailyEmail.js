const fs = require("fs")
const nodemailer = require("nodemailer")
const ejs = require("ejs")
const axios = require("axios")
const {CronJob} = require("cron") 

async function attndEmail(email){

    // const html = fs.readFileSync("./views/employee.ejs",{ encoding: 'utf8', flag: 'r' })
    const webApiUrl = 'https://fusion-api.thereciprocalsolutions.com/api/employeeAttendance/employeeAttendances?date=2024-01-10'
    const Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnREYXRhIjp7ImlkIjo2LCJ0ZW5hbnROYW1lIjoiNWstY2FyLWNhcmUiLCJlbWFpbCI6IjVrQGdtYWlsLmNvbSIsImJpbGxpbmdJbmZvcm1hdGlvbiI6Im5vcm1hbCIsInBsYW5EZXRhaWxzIjp7InZhbGlkaXR5IjoiMTgtMDItMjAyNSIsImNob3NlblBsYW4iOiJiYXNpYyJ9fSwiYnJhbmNoRGF0YSI6eyJpZCI6MSwiYnJhbmNoSWQiOiJDQkUwMDEtMzE2Nzg4NDg5NSIsImJyYW5jaE5hbWUiOiJDQkUwMDEiLCJ0ZW5hbnRJZCI6NiwibG9jYXRpb25EYXRhIjoiQ29pbWJhdG9yZSIsImFkZHJlc3MiOiIxLzIsIFNOUywgQ29pbWJhdG9yZSIsIm1haWwiOltdLCJjcmVhdGVkQXQiOiIyMDIzLTEyLTI1VDE0OjE3OjA0Ljc0OFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTEyLTI1VDE0OjE3OjA0Ljc0OFoifSwiaWF0IjoxNzA1MDQ0NzU2fQ.51R75GmIA1aYxQbphKDn1Tawn9zc411rIfwl4GgNCtk'
    const response = await axios.get(webApiUrl,{headers : {
        "Content-Type" :" application/json; charset=utf-8",
        "Authorization":`Bearer ${Token}`
    }})
    // console.log(response.data);
    const tableData = response.data.list
    

    //Adjusting Eraly and late entry
    let tableBody = [];
    
    tableData.map((row) => {
      let newRow = [];

      let clockedOut = new Date(row.clockOut).getTime();

      const clockInTime = new Date(row.clockIn);
      const nineThirtyAM = new Date(clockInTime);
      nineThirtyAM.setHours(9, 30, 0, 0); // Set to 9:30 AM on the same day as clockInTime
      let earlyEntry = "";
      let lateEntry = "";

      const clockOutTime = new Date(row.clockOut);
      const sixPM = new Date(clockOutTime);
      sixPM.setHours(18, 0, 0, 0);
      let earlyExit = "";
      let lateExit = "";

      newRow.push(row.id);
      newRow.push(row.employeeId);

      newRow.push(
        new Date(row.clockIn).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }),
      );
      if (clockedOut === 0) newRow.push(" Not available");
      else {
        newRow.push(
          new Date(row.clockOut).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          }),
        );
      }

      if (clockInTime < nineThirtyAM) {
        let duration = nineThirtyAM.getTime() - clockInTime.getTime();
        let earlyTimeHour = Math.abs(Math.floor(duration / 1000 / 60 / 60));
        let earlyTimeMin = Math.abs(Math.floor((duration / 1000 / 60) % 60));

        if (earlyTimeHour > 0) {
          earlyEntry += `${earlyTimeHour}h `;
        }
        if (earlyTimeMin > 0) {
          earlyEntry += `${earlyTimeMin}m `;
        }
      } else {
        earlyEntry = "00:00"; // Default value for on-time entries
      }

      newRow.push(earlyEntry);

      if (clockInTime > nineThirtyAM) {
        let duration = clockInTime.getTime() - nineThirtyAM.getTime();

        let lateTimeHour = Math.abs(Math.floor(duration / 1000 / 60 / 60));
        let lateTimeMin = Math.abs(Math.floor((duration / 1000 / 60) % 60));

        if (lateTimeHour > 0) {
          lateEntry += `${lateTimeHour}h `;
        }
        if (lateTimeMin > 0) {
          lateEntry += `${lateTimeMin}m `;
        }
      } else {
        lateEntry = "00:00"; // Default value for on-time entries
      }

      newRow.push(lateEntry);


      if (clockOutTime < sixPM && clockedOut !== 0) {
        let duration = sixPM.getTime() - clockOutTime.getTime();

        let earlyTimeHour = Math.abs(Math.floor(duration / 1000 / 60 / 60));
        let earlyTimeMin = Math.abs(Math.floor((duration / 1000 / 60) % 60));

        if (earlyTimeHour > 0) {
          earlyExit += `${earlyTimeHour}h `;
        }
        if (earlyTimeMin > 0) {
          earlyExit += `${earlyTimeMin}m `;
        }
      } else {
        earlyExit = "00:00"; // Default value for on-time entries
      }

      newRow.push(earlyExit);

      if (clockOutTime > sixPM && clockedOut !== 0) {
        let duration = sixPM.getTime() - clockOutTime.getTime();

        let lateTimeHour = Math.abs(Math.floor(duration / 1000 / 60 / 60));
        let lateTimeMin = Math.abs(Math.floor((duration / 1000 / 60) % 60));

        if (lateTimeHour > 0) {
          lateExit += `${lateTimeHour}h `;
        }
        if (lateTimeMin > 0) {
          lateExit += `${lateTimeMin}m `;
        }
      } else {
        lateExit = "00:00"; // Default value for on-time entries
      }

      newRow.push(lateExit);

      const OutTime = new Date(row.clockOut).getTime();
      const InTime = new Date(row.clockIn).getTime();

      let formattedDuration;
      if (OutTime === 0) {
        formattedDuration = "Not available";
      } else {
        const duration = OutTime - InTime;
        let hour = `${Math.floor(duration / 1000 / 60 / 60)}h `;
        let min = `${Math.floor((duration / 1000 / 60) % 60)}m`;
        formattedDuration = `${hour}${min}`;
      }

      newRow.push(formattedDuration)

      newRow.push(row.attendanceStatus);

      tableBody.push(newRow);
    })

    // console.log(tableBody);

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
        subject : "Daily Attendance Mail",
        text : "Daily attendance report",
        html : await ejs.renderFile("./views/dailyAttendance.ejs",{
            totalEmployees: response.data.totalEmployee,
            employees : tableBody
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

module.exports = {attndEmail}
