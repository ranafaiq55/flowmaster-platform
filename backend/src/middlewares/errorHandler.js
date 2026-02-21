const logger = require("../services/logger");

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  logger.error(err.message || "Server error", { status });
  res.status(status).json({ error: err.message || "Server error" });
}

module.exports = { errorHandler };
