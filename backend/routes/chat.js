const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatController");

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')
const router = express.Router();

router.route("/").post(isAuthenticatedUser, accessChat);
router.route("/").get(isAuthenticatedUser, fetchChats);
router.route("/group").post(isAuthenticatedUser, createGroupChat);
router.route("/rename").put(isAuthenticatedUser, renameGroup);
router.route("/groupremove").put(isAuthenticatedUser, removeFromGroup);
router.route("/groupadd").put(isAuthenticatedUser, addToGroup);

module.exports = router;
