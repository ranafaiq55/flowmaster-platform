import { request } from "./client";

export async function fetchWorkflows(workspaceId) {
  const data = await request(`/api/workflows/workspace/${workspaceId}`);
  return data.workflows;
}

export async function createWorkflow(workspaceId, payload) {
  const data = await request(`/api/workflows/workspace/${workspaceId}`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return data.workflow;
}

export async function triggerWorkflow(workflowId, payload) {
  return request(`/api/workflows/${workflowId}/trigger`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
