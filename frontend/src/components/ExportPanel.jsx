import React from "react";
import { buildExportUrl } from "../api/exports";

export default function ExportPanel({ workspaceId }) {
  if (!workspaceId) {
    return (
      <div>
        <h2>Exports</h2>
        <p>Select a workspace to export workflow runs.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Exports</h2>
      <p>Download workflow run history for reporting.</p>
      <a className="export-link" href={buildExportUrl(workspaceId)}>
        Export CSV
      </a>
    </div>
  );
}
