var express = require('express');
var router = express.Router();

router.use('/user', require('./user'));
router.use('/order', require('./order'));
router.use('/regular-delivery',require('./regular-delivery'));
router.use('/order/delivery', require('./delivery'));

module.exports = router;
