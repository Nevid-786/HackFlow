import express from "express"
import authRouter from "./routes/authRoutes.js"
import connectDB from "./DB/ConnectDb.js";
import {config } from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import hackRouter from "./routes/hackRoutes.js";
import userRouter from "./routes/userRoutes.js";
import teamRouter from "./routes/teamRoutes.js";

config()


const app = express();
app.use(cookieParser())
app.use(cors({
  origin:  process.env.FRONTENDURL,
  credentials: true
}));
app.use(express.json())
app.use(authRouter)
app.use(hackRouter)
app.use(userRouter)
app.use(teamRouter)
app.use("/",(req,res)=>{
    res.status(200).send("Good")
})
connectDB().then(()=>{
app.listen(3000,()=>{
    console.log("Server started:http://localhost:3000")
})
})
