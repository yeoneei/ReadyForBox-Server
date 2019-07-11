var express = require('express');
var router = express.Router();

router.use('/billings', require('./billings'));
router.use('/iamport-callback', require('./iamport-callback'));
router.use('/', require('./payment'));

// 테스트용
router.use('/card-enrollment', require('./card-enrollment'));
router.use('/card', require('./card'));
router.use('/card-payment', require('./card-payment'));

module.exports = router;