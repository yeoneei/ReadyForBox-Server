var express = require('express');
var router = express.Router();

router.use('/billings', require('./billings'));
router.use('/iamport-callback', require('./iamport-callback'));
router.use('/', require('./payment'));

// 테스트용
router.use('/card-enrollment', require('./card-enrollment'));
router.use('/card', require('./card'));

module.exports = router;