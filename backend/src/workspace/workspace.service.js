const Workspace = require("../models/Workspace");
const User = require("../models/User");
const cache = require("../services/cache");

async function listWorkspaces(userId) {
  const cacheKey = `workspaces:${userId}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const workspaces = await Workspace.find({ "members.user": userId }).sort({ createdAt: -1 });
  const result = workspaces.map((workspace) => ({
    id: workspace._id,
    name: workspace.name,
    isPrivate: workspace.isPrivate
  }));

  await cache.set(cacheKey, result, 30);
  return result;
}

async function createWorkspace(userId, name) {
  const workspace = await Workspace.create({
    name,
    owner: userId,
    isPrivate: false,
    members: [{ user: userId, role: "owner" }]
  });

  await cache.del(`workspaces:${userId}`);
  return workspace;
}

async function addMember(workspaceId, email, role) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    const err = new Error("Workspace not found");
    err.status = 404;
    throw err;
  }

  const existing = workspace.members.find((member) => String(member.user) === String(user._id));
  if (existing) {
    existing.role = role;
  } else {
    workspace.members.push({ user: user._id, role });
  }

  await workspace.save();
  await cache.del(`workspaces:${user._id}`);
  return workspace;
}

module.exports = { listWorkspaces, createWorkspace, addMember };
