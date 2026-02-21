const mongoose = require("mongoose");

const workflowRunSchema = new mongoose.Schema(
  {
    workflow: { type: mongoose.Schema.Types.ObjectId, ref: "Workflow", required: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending"
    },
    payload: { type: Object },
    result: { type: Object },
    startedAt: { type: Date },
    finishedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkflowRun", workflowRunSchema);
