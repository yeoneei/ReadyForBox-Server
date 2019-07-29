var express = require('express');
var router = express.Router();

// 아임포트를 통한 카카오페이 일반 결제
router.use('/', require('./kakaopay'));

// 카카오Developer를 통한 카카오페이 정기 결제
router.use('/test', require('./test-kakaopay'))

module.exports = router;