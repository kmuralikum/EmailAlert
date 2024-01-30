const express = require("express")
require("dotenv").config()
const db = require("./config/db")
const alertRoute = require("./routes/alertRoute")
const indexRoute = require("./routes/IndexRoute")
const contentRoute = require("./routes/contentRoute")
const eventRoute = require("./routes/eventRoute")
const checkInAndOutRoute = require("./routes/CheckInAndOutRoute")  
const AttdCron = require("./utils/attendanceCron")
const WeeklyCron = require("./utils/weeklyEmailCron")
const cors = require("cors")
const PORT = process.env.PORT || 3001
const api = process.env.API
const app = express()


//middlewares
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

// Serve static files
app.use(express.static('public'));


// Set up EJS for templating
app.set('view engine' , 'ejs')
app.set("views", "./views")


//routes
app.use("/api/v1/",indexRoute)
app.use("/api/v1/alert",alertRoute)
app.use("/api/v1/contents",contentRoute)
app.use("/api/v1/events",eventRoute)
app.use("/api/v1/attendance",checkInAndOutRoute)
app.use("/*",indexRoute)


//Cron
AttdCron.start()
WeeklyCron.start()


//listening Port
app.listen(PORT , ()=>{
    console.log(`Your server is running successfuly on PORT : http://localhost:${PORT}${api}`);
    db()
})

































