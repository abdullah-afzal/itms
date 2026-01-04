import type { Request, Response } from "express";
import prisma from "../prisma/client.js";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const users = await prisma.user.findMany({select:{id: true, name: true, email: true}})
        res.status(200).json({users, status: "success"});

    } catch (error) {
        res.status(500).json({ error: "Faild to retrive user", status: "fail" })
    }
}
export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized", status: "fail" })
        }

        const user = await prisma.user.findUnique({ where: { id: userId } })
        res.status(200).json({ profile:{email: user?.email, name: user?.name, role: user?.role}, status: "success" });

    } catch (error) {
        res.status(500).json({ message: "Faild to retrive user", status: "fail"});
    }
}
