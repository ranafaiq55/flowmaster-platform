const Workspace = require("../models/Workspace");

function requireRole(allowedRoles) {
  return async (req, res, next) => {
    const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
    if (!workspaceId) {
      return res.status(400).json({ error: "workspaceId required" });
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const membership = workspace.members.find((member) => String(member.user) === String(req.user._id));
    if (!membership || !allowedRoles.includes(membership.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.workspace = workspace;
    return next();
  };
}

module.exports = { requireRole };
