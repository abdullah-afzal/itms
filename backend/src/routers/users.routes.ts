import { Router } from "express";
import { getMe, getUsers } from "../controlers/users.controllers.js";

const router = Router();
router.get('/', getUsers)
router.get('/me', getMe)
export default router;