var express = require('express');
var router = express.Router();

router.use('/product', require('./product'));
router.use('/change', require('./change'));
router.use('/change/address', require('./address'));
router.use('/change/count-minus', require('./count-minus'));
router.use('/change/count-plus', require('./count-plus'));
router.use('/change/memo', require('./memo'));
router.use('/change/cycle', require('./cycle'));
router.use('/change/delivery-day', require('./delivery-day'));
router.use('/change/cancel', require('./cancel'));
router.use('/subscribe', require('./subscribe'));

module.exports = router;