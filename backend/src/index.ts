import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import dashboardRoutes from "./routes/dashboard";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/health", (_, res) => res.json({ status: "ok", app: "Real-Time Study Group Finder" }));

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});


io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("join_group", (groupId) => socket.join(groupId));
  socket.on("message", (data) => io.to(data.groupId).emit("message", data));
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

