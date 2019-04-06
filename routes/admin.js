const path = require('path');
const express = require('express');

const adminController = require('../controllers/admin');
const validateLogin = require('../middleware/validateAuthentication');

const router = express.Router();


router.get('/show-loader-params', validateLogin, adminController.showLoaderParams);
router.get('/generic-loader-parameters', validateLogin, adminController.viewGenericLoaderParams);
router.get('/markup-loader-parameters', validateLogin, adminController.viewMarkupLoaderParams);
router.get('/loader-history', validateLogin, adminController.viewLoaderHistory);
router.get('/web-users', validateLogin, adminController.viewWebUsers);
router.get('/requests', validateLogin, adminController.getRequest);
router.post('/post-request', validateLogin, adminController.postRequest);

// // /admin/add-product => GET
// router.get('/add-product', adminController.getAddProduct);

// // /admin/products => GET
// router.get('/products', adminController.getProducts);

// // /admin/add-product => POST
// router.post('/add-product', adminController.postAddProduct);

// router.get('/edit-product/:productId', adminController.getEditProduct);

// router.post('/edit-product', adminController.postEditProduct);

// router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
