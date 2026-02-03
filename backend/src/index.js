import express from "express"
import authroutes from "./routes/auth.route.js"
import messageroutes from "./routes/message.route.js"
import dotenv from "dotenv"
import { connectdb } from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors";

const app = express();
dotenv.config();

app.use(express.json({limit:"10mb"}));
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/api/auth",authroutes)
app.use("/api/messages",messageroutes)


app.listen(5001,()=>{
    console.log("server is connected sucessfully on 5001")
    connectdb()
})