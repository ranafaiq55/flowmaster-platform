import { request } from "./client";

export async function fetchWorkspaces() {
  const data = await request("/api/workspaces");
  return data.workspaces;
}

export async function createWorkspace(name) {
  const data = await request("/api/workspaces", {
    method: "POST",
    body: JSON.stringify({ name })
  });
  return data.workspace;
}
