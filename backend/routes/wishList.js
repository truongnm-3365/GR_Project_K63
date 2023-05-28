const express = require('express');

const { isAuthenticatedUser } = require('../middlewares/auth');
const { getWishList, addWishList, deleteWishList } = require('../controllers/wishListController');
const router = express.Router();


router.route('/getWishList').get(isAuthenticatedUser,getWishList)
router.route('/addWishList/:id').post(isAuthenticatedUser,addWishList)
router.route('/deleteWishList/:id').delete(isAuthenticatedUser,deleteWishList)

module.exports = router;