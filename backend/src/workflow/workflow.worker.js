const WorkflowRun = require("../models/WorkflowRun");
const Workflow = require("../models/Workflow");
const Workspace = require("../models/Workspace");
const Notification = require("../models/Notification");
const { getIo } = require("../services/socket");
const logger = require("../services/logger");

let workerInterval = null;

async function processRun(run) {
  run.status = "processing";
  run.startedAt = new Date();
  await run.save();

  const workflow = await Workflow.findById(run.workflow);
  const workspace = await Workspace.findById(run.workspace);

  const result = {
    action: workflow.actionType,
    summary: `Processed ${workflow.name}`,
    payload: run.payload || {}
  };

  run.status = "completed";
  run.result = result;
  run.finishedAt = new Date();
  await run.save();

  const message = `Workflow '${workflow.name}' completed`;
  const notifications = workspace.members.map((member) => ({
    workspace: workspace._id,
    user: member.user,
    message
  }));

  await Notification.insertMany(notifications);
  const io = getIo();
  io.to(`workspace:${workspace._id}`).emit("workflow:completed", {
    workflowId: workflow._id,
    runId: run._id,
    message
  });
}

async function poll() {
  const pendingRuns = await WorkflowRun.find({ status: "pending" }).limit(5);
  for (const run of pendingRuns) {
    try {
      await processRun(run);
    } catch (err) {
      logger.error("Workflow run failed", { err: err.message, runId: run._id });
      run.status = "failed";
      run.finishedAt = new Date();
      await run.save();
    }
  }
}

function startWorkflowWorker() {
  if (workerInterval) return;
  workerInterval = setInterval(poll, 5000);
  logger.info("Workflow worker started");
}

module.exports = { startWorkflowWorker };
