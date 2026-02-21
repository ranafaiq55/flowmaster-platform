const { Parser } = require("json2csv");
const WorkflowRun = require("../models/WorkflowRun");
const Workspace = require("../models/Workspace");

async function exportWorkflowRuns(req, res, next) {
  try {
    const { workspaceId } = req.query;
    if (!workspaceId) {
      return res.status(400).json({ error: "workspaceId required" });
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const isMember = workspace.members.some((member) => String(member.user) === String(req.user._id));
    if (!isMember) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const runs = await WorkflowRun.find({ workspace: workspaceId }).sort({ createdAt: -1 }).limit(200);
    const rows = runs.map((run) => ({
      id: run._id,
      status: run.status,
      createdAt: run.createdAt,
      finishedAt: run.finishedAt,
      summary: run.result?.summary || ""
    }));

    const parser = new Parser({ fields: ["id", "status", "createdAt", "finishedAt", "summary"] });
    const csv = parser.parse(rows);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=workflow-runs.csv");
    res.send(csv);
  } catch (err) {
    next(err);
  }
}

module.exports = { exportWorkflowRuns };
