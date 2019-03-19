const path = require('path');

const express = require('express');
const router = express.Router();

const partsController = require('../controllers/parts');

router.get('/', partsController.getIndex)
router.get('/list-parts', partsController.getParts);
router.get('/part-detail/:partId', partsController.getPart);

module.exports = router;