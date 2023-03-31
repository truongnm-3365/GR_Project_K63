const express = require('express');
const { newCategory, updateCategory, deleteCategory, getCategories, getCategory } = require('../controllers/categoryController');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/categories').get(getCategories);
router.route('/admin/category/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getCategory)
router.route('/admin/category/new').post(isAuthenticatedUser,authorizeRoles('admin'), newCategory);
router.route('/admin/category/update/:id').put(isAuthenticatedUser,authorizeRoles('admin'), updateCategory);
router.route('/admin/category/delete/:id').delete(isAuthenticatedUser,authorizeRoles('admin'), deleteCategory);

module.exports = router;