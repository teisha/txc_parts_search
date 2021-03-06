'use strict';
const path = require('path');
const express = require('express');

const vendorController = require('../controllers/vendors');
const validateLogin = require('../middleware/validateAuthentication');

const router = express.Router();


router.get('/vendors', validateLogin, vendorController.viewVendors);
router.get('/history/:vendorId', validateLogin, vendorController.showVendorHistory);


module.exports = router;