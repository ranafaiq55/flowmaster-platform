const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: {
      type: String,
      enum: ["owner", "admin", "member", "viewer"],
      default: "member"
    }
  },
  { _id: false }
);

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPrivate: { type: Boolean, default: false },
    members: [memberSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workspace", workspaceSchema);
