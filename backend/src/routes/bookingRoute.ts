// backend/routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingSummary,
} from "../controllers/bookingController.js";
import { authenticate } from "../middleware/auth.ts";
import { authorize } from "../middleware/guard.ts";

const router = express.Router();

router.post("/create", createBooking);

router.get("/", getAllBookings);
router.delete("/:id", deleteBooking); 

router.get("/summary", authorize("owner", "admin"), getBookingSummary);

export default router;
