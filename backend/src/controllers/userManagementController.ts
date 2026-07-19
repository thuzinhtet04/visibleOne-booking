import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import { auth } from "../lib/auth.js";
import prisma from "../lib/prisma.js";


export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Failed to retrieve user accounts." });
  }
};


export const createUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({
          error: "name, email, and password fields are strictly required.",
        });
    }

    if (role && !["admin", "owner", "user"].includes(role)) {
      return res.status(400).json({
        error: "Invalid role assigned. Must be 'admin', 'owner', or 'user'.",
      });
    }

    const { user } = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        role: role || "user",
      },
    });

    return res.status(201).json({
      message: "User provisioned successfully.",
      user,
    });
  } catch (error: any) {
    if (error?.status === 422 || error?.statusCode === 422) {
      return res.status(409).json({
        error: "A registration record with this email already exists.",
      });
    }
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ error: "Internal server error creating user account." });
  }
};


export const updateUserRole = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = req.params.id as string;
    const { role } = req.body;

    if (!role || !["admin", "owner", "user"].includes(role)) {
      return res.status(400).json({
        error:
          "Please provide a valid target role: 'admin', 'owner', or 'user'.",
      });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return res.status(404).json({ error: "Target user account not found." });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return res.status(200).json({
      message: `User permissions upgraded successfully to ${role}.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating role:", error);
    return res.status(500).json({
      error: "Internal server error while updating user permissions.",
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = req.params.id as string;

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return res.status(404).json({ error: "Target user account not found." });
    }
    const authReq = req as AuthenticatedRequest;

    // Prevent Self-Deletion Lockouts
    const requestingAdminId = authReq.user?.id;
    if (id === requestingAdminId) {
      return res.status(400).json({
        error:
          "Action rejected: You cannot delete your own active administrative session.",
      });
    }

    await prisma.user.delete({ where: { id } });

    return res.status(200).json({
      message:
        "User profile and all associated room bookings purged successfully.",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ error: "Internal server error while executing profile purge." });
  }
};
