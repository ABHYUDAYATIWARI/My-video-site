import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app=express()

app.use(cors({
    origin:process.env.CORS_URL,
    credentials:true
}))

app.use(express.json({limit:"100kb"}))
app.use(express.urlencoded({extended:true,limit:"100kb"}))
app.use(express.static("public"))
app.use(cookieParser())



// routes import
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.route.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import subsRouter from "./routes/subscription.routes.js"

//route declar
app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/subs", subsRouter)

export{app}