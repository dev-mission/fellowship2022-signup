const express = require('express');

const router = express.Router();

router.use('/assets', require('./assets'));
router.use('/auth', require('./auth'));
router.use('/passwords', require('./passwords'));
router.use('/users', require('./users'));
router.use('/programs', require('./programs'));
router.use('/locations', require('./locations'));
router.use('/visits', require('./visits'));

module.exports = router;
