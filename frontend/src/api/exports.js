import { API_URL, getAccessToken } from "./client";

export function buildExportUrl(workspaceId) {
  const token = getAccessToken();
  const params = new URLSearchParams({ workspaceId });
  if (token) {
    params.set("token", token);
  }
  return `${API_URL}/api/exports/workflow-runs?${params.toString()}`;
}
