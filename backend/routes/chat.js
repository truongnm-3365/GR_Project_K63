const express = require("express");
const {
  accessChat,
  fetchChats,
} = require("../controllers/chatController");

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')
const router = express.Router();

router.route("/").post(isAuthenticatedUser, accessChat);
router.route("/").get(isAuthenticatedUser, fetchChats);


module.exports = router;
