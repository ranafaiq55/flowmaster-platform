import React, { useState } from "react";

export default function WorkflowList({ workflows, onCreate, onTrigger, workspaceId }) {
  const [form, setForm] = useState({ name: "", triggerType: "invoice.created", actionType: "notify" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!workspaceId) return;
    await onCreate(form);
    setForm({ name: "", triggerType: "invoice.created", actionType: "notify" });
  };

  return (
    <div>
      <div className="panel-header">
        <h2>Workflows</h2>
        <span>{workspaceId ? "Active" : "Select workspace"}</span>
      </div>
      <div className="workflow-list">
        {workflows.length === 0 && <p>No workflows yet. Create one below.</p>}
        {workflows.map((workflow) => (
          <div key={workflow.id} className="workflow-card">
            <div>
              <h3>{workflow.name}</h3>
              <p>{workflow.triggerType} → {workflow.actionType}</p>
            </div>
            <button onClick={() => onTrigger(workflow.id)}>Trigger</button>
          </div>
        ))}
      </div>
      <form className="workflow-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Workflow name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Trigger type"
          value={form.triggerType}
          onChange={(event) => setForm({ ...form, triggerType: event.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Action type"
          value={form.actionType}
          onChange={(event) => setForm({ ...form, actionType: event.target.value })}
          required
        />
        <button type="submit">Create workflow</button>
      </form>
    </div>
  );
}
