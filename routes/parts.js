'use strict';
const path = require('path');

const express = require('express');
const router = express.Router();

const partsController = require('../controllers/parts');
const validateLogin = require('../middleware/validateAuthentication');

router.get('/index', validateLogin, partsController.getIndex);
router.get('/list-parts', validateLogin, partsController.getParts);
router.post('/list-parts-previous', validateLogin, partsController.getPreviousParts);
router.post('/list-parts-next', validateLogin, partsController.getNextParts);
router.get('/part-detail/:partId', validateLogin, partsController.getPart);
router.post('/part-search', validateLogin, partsController.searchParts);
router.post('/part-back', validateLogin, partsController.goBack);

module.exports = router;