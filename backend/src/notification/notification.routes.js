const express = require("express");
const notificationController = require("./notification.controller");

const router = express.Router();

router.get("/", notificationController.list);
router.post("/:notificationId/read", notificationController.markRead);

module.exports = router;
