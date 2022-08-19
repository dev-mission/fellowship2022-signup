const express = require('express');

const router = express.Router();

router.use('/assets', require('./assets'));
router.use('/auth', require('./auth'));
router.use('/passwords', require('./passwords'));
router.use('/users', require('./users'));
router.use('/program', require('./program'));
router.use('/location', require('./location'));
router.use('/visit', require('./visit'));

module.exports = router;
