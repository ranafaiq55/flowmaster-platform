const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Workspace = require("../models/Workspace");

function signAccessToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m"
  });
}

function signRefreshToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d"
  });
}

async function createDefaultWorkspace(user) {
  const workspace = await Workspace.create({
    name: `${user.name}'s Private Workspace`,
    owner: user._id,
    isPrivate: true,
    members: [{ user: user._id, role: "owner" }]
  });
  return workspace;
}

async function register({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("Email already in use");
    err.status = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  await createDefaultWorkspace(user);

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
}

async function refresh(userId, refreshToken) {
  const user = await User.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    const err = new Error("Invalid refresh token");
    err.status = 401;
    throw err;
  }

  const accessToken = signAccessToken(user._id);
  const newRefreshToken = signRefreshToken(user._id);
  user.refreshToken = newRefreshToken;
  await user.save();

  return { user, accessToken, refreshToken: newRefreshToken };
}

async function logout(userId) {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
}

module.exports = { register, login, refresh, logout, signAccessToken, signRefreshToken };
