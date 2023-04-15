const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageController");

const { isAuthenticatedUser } = require('../middlewares/auth')

const router = express.Router();

router.route("/:chatId").get(isAuthenticatedUser, allMessages);
router.route("/").post(isAuthenticatedUser, sendMessage);

module.exports = router;
