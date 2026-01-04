import type { Request, Response } from "express";
import prisma from "../prisma/client.js";
import { Status } from "../prisma/generated/enums.js";

const TASK_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"] as const;
type TaskStatus = typeof TASK_STATUSES[number];

export const createTask = async (req: Request, res: Response) => {
    try {
        const currentUserId = (req as any).user.userId;
        if (!currentUserId) {
            return res.status(401).json({ message: "Unauthorized", status: "fail" })
        }
        const { title, description, userId } = req.body || {};

        if (!title || !description) {
            return res.status(400).json({
                message: "Missing values",
                requiredValues: { title: "string", description: "string" },
                status: "fail"
            });
        }
        const task = await prisma.task.create({
            data: { title, description, userId: userId ? userId : currentUserId }
        })
        res.status(200).json({ message: "Task created successfully", task, status: "success" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Faild to create task", status: "fail" });
    }
}

export const getTasks = async (req: Request, res: Response) => {

    try {
        const userId = (req as any).user.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized", status: "fail" })
        }
        const { status } = req.query;
        if (!status) {
            const tasks = await prisma.task.findMany({include:{user:true}});
            return res.status(200).json({ tasks, status: "success" });
        }

        const searchStatus = String(status).toUpperCase();
        const validStatuses = Object.values(Status);

        if (!validStatuses.includes(searchStatus as Status)) {
            return res.status(400).json({
                message: "Invalid status value",
                validOptions: validStatuses,
                status: "fail"
            });
        }


        const tasks = await prisma.task.findMany({
            where: { status: searchStatus as Status }
        });

        res.status(200).json({ tasks, status: "success" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Faild to retrive tasks", status: "fail" });
    }
}

export const editTaskStatus = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized", status: "fail" })
        }

        const { id } = req.params || {};
        if (!id) {
            return res.status(400).json({ message: "Task ID is required", status: "fail" });
        }
        const { status } = req.body || {};
        if (!status || !TASK_STATUSES.includes(status as TaskStatus)) {
            return res.status(400).json({
                message: `Invalid status. Allowed values: ${TASK_STATUSES.join(", ")}`, status: "fail"
            });
        }
        const task = await prisma.task.update({ where: { id }, data: { status: status } });
        res.status(200).json({ message: "Task updated successfully", task, status: "success" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Faild to update task", status: "fail" });
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized", status: "fail" })
        }
        const { id } = req.params || {};
        if (!id) {
            return res.status(400).json({ message: "Task ID is required", status: "fail" });
        }
        const task = await prisma.task.delete({ where: { id } });
        res.status(200).json({ message: "Task deleted successfully", task, status: "success" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Faild to delete task", status: "fail" });
    }
}

