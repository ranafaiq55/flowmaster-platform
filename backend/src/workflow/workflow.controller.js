const workflowService = require("./workflow.service");
const { getIo } = require("../services/socket");

async function list(req, res, next) {
  try {
    const workflows = await workflowService.listWorkflows(req.params.workspaceId);
    res.json({ workflows });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const workflow = await workflowService.createWorkflow(req.params.workspaceId, req.body);
    res.status(201).json({ workflow: { id: workflow._id, name: workflow.name } });
  } catch (err) {
    next(err);
  }
}

async function trigger(req, res, next) {
  try {
    const { run, workspace } = await workflowService.triggerWorkflow(
      req.params.workflowId,
      req.body,
      req.user._id
    );
    const io = getIo();
    io.to(`workspace:${workspace._id}`).emit("workflow:queued", {
      runId: run._id,
      workflowId: run.workflow
    });
    res.json({ runId: run._id, status: run.status });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, trigger };
