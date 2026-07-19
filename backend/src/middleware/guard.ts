import { type Request, type Response, type NextFunction } from "express";
import type { Role } from "../lib/auth.js";
import type { AuthenticatedRequest } from "./auth.js";

export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!roles.includes(authReq.user.role as Role)) {
      res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
      return;
    }

    next();
  };
}
