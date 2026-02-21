require("dotenv").config();
const http = require("http");
const { app } = require("./app");
const { connectMongo } = require("./database/mongo");
const { initSocket } = require("./services/socket");
const { startWorkflowWorker } = require("./workflow/workflow.worker");
const logger = require("./services/logger");

const port = process.env.PORT || 4000;

async function start() {
  await connectMongo();

  const server = http.createServer(app);
  initSocket(server);
  startWorkflowWorker();

  server.listen(port, () => {
    logger.info(`API listening on ${port}`);
  });
}

start().catch((err) => {
  logger.error("Failed to start server", { err: err.message });
  process.exit(1);
});
