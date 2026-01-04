import type { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction){
console.log(`${new Date().toISOString()} | ${req.method} | ${req.originalUrl}`)
res.on("finish", ()=>{console.log(`${new Date().toISOString()} | ${req.method} | ${req.originalUrl} | ${res.statusCode}`)})
next();
}