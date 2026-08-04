import express from "express"
import authRouter from "./routes/authRoutes.js"
import connectDB from "./DB/ConnectDb.js";
import { config } from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import hackRouter from "./routes/hackRoutes.js";
import userRouter from "./routes/userRoutes.js";
import teamRouter from "./routes/teamRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import { hackLimiter, userLimiter, teamLimiter, adminLimiter } from "./middleWare/rateLimiter.js";


config()

const app = express();
app.use(cookieParser())
app.use(cors({
  origin: process.env.FRONTENDURL,
  credentials: true
}));
app.set("trust proxy", 1);
app.use(express.json())
app.use(authRouter)
app.use(hackLimiter, hackRouter)
app.use(userLimiter, userRouter)
app.use(teamLimiter, teamRouter)
app.use("/admin", adminLimiter, adminRouter);
app.use("/", (req, res) => {
    res.status(200).send("Good")
})
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
 
  app.listen(PORT, () => {
    console.log("Server started:http://localhost:3000", process.env.NODE_ENV === "production")
  })
})