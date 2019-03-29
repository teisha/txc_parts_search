const path = require('path');

const express = require('express');
const router = express.Router();

const partsController = require('../controllers/parts');
const validateLogin = require('../middleware/validateAuthentication');

router.get('/index', partsController.getIndex);
router.get('/list-parts', partsController.getParts);
router.get('/list-parts-previous', partsController.getPreviousParts);
router.get('/list-parts-next', partsController.getNextParts);
router.get('/part-detail/:partId', validateLogin, partsController.getPart);
router.post('/part-search', validateLogin, partsController.searchParts);

module.exports = router;