import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(import.meta.dirname, "../../.env") });

import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { authenticate, type AuthenticatedRequest } from "./middleware/auth.js";
import bookingRouter from "./routes/bookingRoute.ts";
import userManagementRouter from "./routes/userManagementRoute.ts";
import cors from "cors";

const app = express();
const port = 3000;
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

const api = express.Router();

// apply auth middleware
api.use(authenticate);
api.use("/booking", bookingRouter); // Handles bookings
api.use("/users", userManagementRouter); // Handles bookings
app.use("/api/v1", api);


//serve react pages as static html
app.use(express.static(path.join(import.meta.dirname, "..", "..", "dist")));
app.get("/{*splat}", (req, res) => {
  res.sendFile(
    path.join(import.meta.dirname, "..", "..", "dist", "index.html"),
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
