const express = require('express')
const router = express.Router();

const { getMeNotifies,deleteAllNotifies, deleteAllNotifiesMessage } = require('../controllers/notifyController')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/me/notifies/:userId').get(isAuthenticatedUser,getMeNotifies);

router.route('/me/notifies/delete/:userId').delete(isAuthenticatedUser,deleteAllNotifies)

router.route('/me/notifies/delete-message/:userId').delete(isAuthenticatedUser,deleteAllNotifiesMessage)

module.exports = router;