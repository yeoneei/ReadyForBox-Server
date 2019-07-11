var express = require('express');
var router = express.Router();

router.use('/billings', require('./billings'));
router.use('/iamport-callback', require('./iamport-callback'));
router.use('/', require('./payment'));

// 테스트용
router.use('/payment_test', require('./payment_test'));
router.use('/billings_test', require('./billings_test'));

module.exports = router;