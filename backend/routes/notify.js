const express = require('express')
const router = express.Router();

const { getMeNotifies,deleteAllNotifies } = require('../controllers/notifyController')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/me/notifies/:userId').get(isAuthenticatedUser,getMeNotifies);

router.route('/me/notifies/delete/:userId').delete(isAuthenticatedUser,deleteAllNotifies)

module.exports = router;