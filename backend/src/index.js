import express from "express"
import authroutes from "./routes/auth.route.js"
import messageroutes from "./routes/message.route.js"
import dotenv from "dotenv"
import { connectdb } from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors";
import { app,server } from "./lib/socket.js"
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
app.use(express.json({limit:"10mb"}));
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));



app.use("/api/auth",authroutes)
app.use("/api/messages",messageroutes)

if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "../../frontend/dist"))
  );

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../../frontend/dist/index.html")
    );
  });
}

server.listen(5001,()=>{
    console.log("server is connected sucessfully on 5001")
    connectdb()
})