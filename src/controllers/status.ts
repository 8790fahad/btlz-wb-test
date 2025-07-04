import { Request, Response } from "express";

export const getStatus = (req: Request, res: Response): void => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "Service is up and running 🚀",
  });
};