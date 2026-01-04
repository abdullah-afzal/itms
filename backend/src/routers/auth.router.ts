import { Router } from "express";
import { login, signUp } from "../controlers/auth.controllers.js";

const router = Router();
router.post('/login', login);
router.post('/register', signUp)

export default router;