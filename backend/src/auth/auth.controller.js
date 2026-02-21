const jwt = require("jsonwebtoken");
const authService = require("./auth.service");

function setRefreshCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    setRefreshCookie(res, result.refreshToken);
    res.status(201).json({
      user: { id: result.user._id, email: result.user.email, name: result.user.name },
      accessToken: result.accessToken
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    setRefreshCookie(res, result.refreshToken);
    res.json({
      user: { id: result.user._id, email: result.user.email, name: result.user.name },
      accessToken: result.accessToken
    });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const result = await authService.refresh(payload.sub, token);
    setRefreshCookie(res, result.refreshToken);
    res.json({
      user: { id: result.user._id, email: result.user.email, name: result.user.name },
      accessToken: result.accessToken
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      await authService.logout(payload.sub);
    }
    res.clearCookie("refreshToken");
    res.json({ status: "ok" });
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  res.json({ user: { id: req.user._id, email: req.user.email, name: req.user.name } });
}

module.exports = { register, login, refresh, logout, me };
