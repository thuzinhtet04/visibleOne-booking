import express, { Router } from "express";
import {
  getAllUsers,
  createUser,
  updateUserRole,
  deleteUser,
} from "../controllers/userManagementController.ts";

import { authorize } from "../middleware/guard.ts";

const router: Router = express.Router();

router.use(authorize("admin"));


router.get("/", getAllUsers); 
router.post("/create", createUser); 
router.patch("/:id/role", updateUserRole); 
router.delete("/:id", deleteUser); 

export default router;
