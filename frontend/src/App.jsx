import React, { useMemo, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./hooks/useAuth";
import { fetchWorkspaces, createWorkspace } from "./api/workspace";
import { fetchWorkflows, createWorkflow, triggerWorkflow } from "./api/workflow";
import { fetchNotifications } from "./api/notification";
import { useSocket } from "./hooks/useSocket";
import AuthForm from "./components/AuthForm";
import Layout from "./components/Layout";
import WorkflowList from "./components/WorkflowList";
import NotificationPanel from "./components/NotificationPanel";
import ExportPanel from "./components/ExportPanel";

export default function App() {
  const { user, status, login, register, logout } = useAuth();
  const queryClient = useQueryClient();
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const workspacesQuery = useQuery({
    queryKey: ["workspaces"],
    queryFn: fetchWorkspaces,
    enabled: status === "authenticated"
  });

  const activeWorkspace = useMemo(() => {
    if (!workspacesQuery.data || workspacesQuery.data.length === 0) return null;
    return workspacesQuery.data.find((workspace) => workspace.id === activeWorkspaceId) || workspacesQuery.data[0];
  }, [workspacesQuery.data, activeWorkspaceId]);

  const workflowsQuery = useQuery({
    queryKey: ["workflows", activeWorkspace?.id],
    queryFn: () => fetchWorkflows(activeWorkspace.id),
    enabled: !!activeWorkspace
  });

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: status === "authenticated"
  });

  const handleSocketEvent = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["workflows"] });
  }, [queryClient]);

  useSocket({
    enabled: status === "authenticated",
    onEvent: handleSocketEvent
  });

  if (status === "loading") {
    return <div className="center">Loading...</div>;
  }

  if (status !== "authenticated") {
    return <AuthForm onLogin={login} onRegister={register} />;
  }

  const handleCreateWorkspace = async (event) => {
    event.preventDefault();
    if (!newWorkspaceName.trim()) return;
    await createWorkspace(newWorkspaceName.trim());
    setNewWorkspaceName("");
    queryClient.invalidateQueries({ queryKey: ["workspaces"] });
  };

  const handleCreateWorkflow = async (payload) => {
    if (!activeWorkspace) return;
    await createWorkflow(activeWorkspace.id, payload);
    queryClient.invalidateQueries({ queryKey: ["workflows", activeWorkspace.id] });
  };

  const handleTriggerWorkflow = async (workflowId) => {
    await triggerWorkflow(workflowId, { triggeredBy: user.name });
  };

  return (
    <Layout user={user} onLogout={logout}>
      <section className="panel">
        <h2>Workspaces</h2>
        <div className="workspace-list">
          {workspacesQuery.data?.map((workspace) => (
            <button
              key={workspace.id}
              className={workspace.id === activeWorkspace?.id ? "active" : ""}
              onClick={() => setActiveWorkspaceId(workspace.id)}
            >
              {workspace.name}
            </button>
          ))}
        </div>
        <form className="inline-form" onSubmit={handleCreateWorkspace}>
          <input
            type="text"
            placeholder="New workspace name"
            value={newWorkspaceName}
            onChange={(event) => setNewWorkspaceName(event.target.value)}
          />
          <button type="submit">Create</button>
        </form>
      </section>

      <section className="panel">
        <WorkflowList
          workflows={workflowsQuery.data || []}
          onCreate={handleCreateWorkflow}
          onTrigger={handleTriggerWorkflow}
          workspaceId={activeWorkspace?.id}
        />
      </section>

      <section className="panel grid">
        <NotificationPanel notifications={notificationsQuery.data || []} />
        <ExportPanel workspaceId={activeWorkspace?.id} />
      </section>
    </Layout>
  );
}
