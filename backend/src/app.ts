import "dotenv/config"
import express from "express"
import cors from "cors"
import { requestLogger } from "./middlewares/logger.middleware.js";
import router from "./routers/index.js";

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}))
app.use(express.json());
app.use(requestLogger)
app.get('/health',(_,res)=>{
    res.send("Runing").status(200);
})

app.use("/", router);

export default app;