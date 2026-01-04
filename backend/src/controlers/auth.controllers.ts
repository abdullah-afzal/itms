import type { Request, Response } from "express";
import prisma from "../prisma/client.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body || {};
        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Missing Values",
                requiredValues: "name, email, and password are required fields"
            })
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({ data: { name, email, role, password: hashedPassword } })
        res.status(200).json({ message: "User account created successfully", status: "success" })
    } catch (error) {
        res.status(500).json({ message: "User account creation failed", status: "fail" })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({
                error: "Missing values",
                requiredValues: { email: "string", password: "string" }
            });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );

        res.status(200).json({ message: "Login successfull", token, status: "success" })

    } catch (error) {
        res.status(500).json({ message: "Login failed", status: "fail" });
    }
}

