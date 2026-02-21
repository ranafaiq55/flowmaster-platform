const express = require("express");
const workspaceController = require("./workspace.controller");
const { requireRole } = require("../middlewares/requireRole");

const router = express.Router();

router.get("/", workspaceController.list);
router.post("/", workspaceController.create);
router.post("/:workspaceId/members", requireRole(["owner", "admin"]), workspaceController.addMember);

module.exports = router;
