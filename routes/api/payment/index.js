var express = require('express');
var router = express.Router();

router.use('/billings', require('./billings'));
router.use('/iamport-callback', require('./iamport-callback'));
router.use('/', require('./payment'));
router.use('/payment_test', require('./payment_test'));

module.exports = router;