import { Router } from "express";
import { createTask, deleteTask, editTaskStatus, getTasks } from "../controlers/tasks.controllers.js";

const router = Router();
router.post('/', createTask);
router.get('/', getTasks)
router.put('/:id', editTaskStatus)
router.delete('/:id', deleteTask)

export default router;