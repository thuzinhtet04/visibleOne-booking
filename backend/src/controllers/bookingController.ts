import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import prisma from "../lib/prisma.js";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { startTime, endTime } = req.body;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;

    if (!startTime || !endTime) {
      return res
        .status(400)
        .json({ error: "Both startTime and endTime are required." });
    }

    //check iso string format
    const isoRegex =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
    if (!isoRegex.test(startTime) || !isoRegex.test(endTime)) {
      return res
        .status(400)
        .json({
          error:
            "startTime and endTime must be ISO 8601 strings with timezone offset (e.g. 2025-01-01T12:00:00Z or 2025-01-01T12:00:00+05:00).",
        });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format provided." });
    }

    const now = new Date();
    if (start <= now) {
      return res
        .status(400)
        .json({ error: "startTime must be in the future." });
    }

    if (start >= end) {
      return res
        .status(400)
        .json({ error: "startTime must be strictly before endTime." });
    }

    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        AND: [
          { startTime: { lt: end } }, // Existing Start is less than New End
          { endTime: { gt: start } }, // Existing End is greater than New Start
        ],
      },
    });

    if (conflictingBooking) {
      return res.status(409).json({
        error:
          "Booking slot unavailable. It overlaps with an existing reservation.",
      });
    }

    const newBooking = await prisma.booking.create({
      data: {
        userId,
        startTime: start,
        endTime: end,
      },
    });

    return res.status(201).json({
      message: "Booking created successfully.",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error occurred while booking." });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { startTime: "asc" },
      include: {
        user: { select: { id: true, name: true, role: true } }, 
      },
    });
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch bookings." });
  }
};


export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const requestingUser = (req as any).user;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }


    if (
      requestingUser.role === "user" &&
      booking.userId !== requestingUser.id
    ) {
      return res
        .status(403)
        .json({ error: "Forbidden: You can only delete your own bookings." });
    }

    await prisma.booking.delete({ where: { id } });
    return res.status(200).json({ message: "Booking deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete booking." });
  }
};


export const getBookingSummary = async (req: Request, res: Response) => {
  try {
    const summary = await prisma.booking.groupBy({
      by: ["userId"],
      _count: {
        id: true,
      },
    });

    
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });

    const detailedSummary = summary.map((item) => {
      const matchedUser = users.find((u) => u.id === item.userId);
      return {
        userId: item.userId,
        userName: matchedUser?.name || "Unknown User",
        totalBookings: item._count.id,
      };
    });

    return res.status(200).json(detailedSummary);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to generate dynamic stats summary." });
  }
};
