const express = require("express");
const workflowController = require("./workflow.controller");
const { requireRole } = require("../middlewares/requireRole");

const router = express.Router();

router.get("/workspace/:workspaceId", requireRole(["owner", "admin", "member", "viewer"]), workflowController.list);
router.post("/workspace/:workspaceId", requireRole(["owner", "admin", "member"]), workflowController.create);
router.post("/:workflowId/trigger", workflowController.trigger);

module.exports = router;
