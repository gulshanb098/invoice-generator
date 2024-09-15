import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Authorization header missing || Unauthorized user" });
  }

  // Extract token from the header
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Token missing || Unauthorized user" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.body.userId = (decoded as any).userId;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid access token" });
  }
};
