'use strict';
const path = require('path');

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const validateLogin = require('../middleware/validateAuthentication');

router.get('/', authController.getLogin);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', validateLogin, authController.postLogout);

module.exports = router;