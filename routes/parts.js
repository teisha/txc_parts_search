const path = require('path');

const express = require('express');
const router = express.Router();

const partsController = require('../controllers/parts');

router.get('/index', partsController.getIndex);
router.get('/list-parts', partsController.getParts);
router.get('/list-parts-previous', partsController.getPreviousParts);
router.get('/list-parts-next', partsController.getNextParts);
router.get('/part-detail/:partId', partsController.getPart);
router.post('/part-search', partsController.searchParts);

module.exports = router;