const express = require('express');

const { isAuthenticatedUser } = require('../middlewares/auth');
const { getFollowingList, getFollowList, addFollow, deleteFollow } = require('../controllers/followController');

const router = express.Router();


router.route('/getFollowings/:id').get(getFollowingList)
router.route('/getFollowers/:id').get(getFollowList)
router.route('/addFollow/:id').post(isAuthenticatedUser,addFollow)
router.route('/deleteFollow/:id').delete(isAuthenticatedUser,deleteFollow)

module.exports = router;