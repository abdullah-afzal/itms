import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1] as string;
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token", status: "fail" });
    }
};