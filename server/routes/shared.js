const express = require('express');
const router = express.Router();
const { getSharedNote } = require('../controllers/sharedController');

router.get('/:shareId', getSharedNote);

module.exports = router;
