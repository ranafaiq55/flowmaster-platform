const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middlewares/errorHandler");
const authRoutes = require("./auth/auth.routes");
const workspaceRoutes = require("./workspace/workspace.routes");
const workflowRoutes = require("./workflow/workflow.routes");
const notificationRoutes = require("./notification/notification.routes");
const exportController = require("./controllers/export.controller");
const { requireAuth } = require("./middlewares/requireAuth");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", requireAuth, workspaceRoutes);
app.use("/api/workflows", requireAuth, workflowRoutes);
app.use("/api/notifications", requireAuth, notificationRoutes);
app.get("/api/exports/workflow-runs", requireAuth, exportController.exportWorkflowRuns);

app.use(errorHandler);

module.exports = { app };
