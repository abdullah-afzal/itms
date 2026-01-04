import {Router} from "express";
import userRouters from "./users.routes.js";
import taskRouters from "./tasks.routes.js";
import authRouters from "./auth.router.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use("/auth", authRouters);
router.use("/users", protect, userRouters);
router.use("/tasks", protect ,taskRouters);

export default router;