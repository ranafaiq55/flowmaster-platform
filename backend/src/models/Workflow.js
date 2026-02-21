const mongoose = require("mongoose");

const workflowSchema = new mongoose.Schema(
  {
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    name: { type: String, required: true },
    triggerType: { type: String, required: true },
    actionType: { type: String, required: true },
    enabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workflow", workflowSchema);
