const Workflow = require("../models/Workflow");
const WorkflowRun = require("../models/WorkflowRun");
const Workspace = require("../models/Workspace");

async function listWorkflows(workspaceId) {
  const workflows = await Workflow.find({ workspace: workspaceId }).sort({ createdAt: -1 });
  return workflows.map((workflow) => ({
    id: workflow._id,
    name: workflow.name,
    triggerType: workflow.triggerType,
    actionType: workflow.actionType,
    enabled: workflow.enabled
  }));
}

async function createWorkflow(workspaceId, payload) {
  const workflow = await Workflow.create({
    workspace: workspaceId,
    name: payload.name,
    triggerType: payload.triggerType,
    actionType: payload.actionType,
    enabled: payload.enabled !== false
  });
  return workflow;
}

async function triggerWorkflow(workflowId, payload, userId) {
  const workflow = await Workflow.findById(workflowId);
  if (!workflow || !workflow.enabled) {
    const err = new Error("Workflow not found or disabled");
    err.status = 404;
    throw err;
  }

  const workspace = await Workspace.findById(workflow.workspace);
  const isMember = workspace.members.some((member) => String(member.user) === String(userId));
  if (!isMember) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
  const run = await WorkflowRun.create({
    workflow: workflow._id,
    workspace: workflow.workspace,
    status: "pending",
    payload
  });

  return { run, workspace };
}

module.exports = { listWorkflows, createWorkflow, triggerWorkflow };
