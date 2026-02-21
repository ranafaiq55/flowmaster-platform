const workspaceService = require("./workspace.service");

async function list(req, res, next) {
  try {
    const workspaces = await workspaceService.listWorkspaces(req.user._id);
    res.json({ workspaces });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name } = req.body;
    const workspace = await workspaceService.createWorkspace(req.user._id, name);
    res.status(201).json({ workspace: { id: workspace._id, name: workspace.name } });
  } catch (err) {
    next(err);
  }
}

async function addMember(req, res, next) {
  try {
    const { email, role } = req.body;
    const workspace = await workspaceService.addMember(req.params.workspaceId, email, role);
    res.json({ workspace: { id: workspace._id, name: workspace.name } });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, addMember };
