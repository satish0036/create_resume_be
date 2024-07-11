import dotenv from 'dotenv';
import Express from "express";
import PostRoutes from "./routes/PostRoutes.js"
import cors from "cors"
import AddResumeRoutes from './routes/AddResumeRoutes.js';
// import cookieParser from "cookie-parser";
const PORT=process.env.PORT || 8800;
const app=Express();

dotenv.config();


app.use(cors({
    origin: ['http://localhost:3000','/',"http://localhost:5173" ],
    credentials: true,
  }));
  
//   app.use(cookieParser())
  app.use(Express.json())


app.use("/api/post",PostRoutes)
app.use("/api/resume",AddResumeRoutes)

app.listen(PORT,(req,res)=>{
    console.log("connected to Backend")
})