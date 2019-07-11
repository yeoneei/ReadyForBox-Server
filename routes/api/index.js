var express = require('express');
var router = express.Router();

router.use('/product',require('./product'));
router.use('/mypage', require('./mypage'));
router.use('/auth', require('./auth'));
router.use('/payment', require('./payment'));
router.use('/users', require('./users'));

//csv파일로 한 번에 실제 데이터 삽입
router.use('/insert_data', require('./insert_data'));

router.use('/postcode', require('./postcode'));

router.get('/test', function(req, res) {
    console.log('test창 테스트');
    res.render('test');
})



module.exports = router;
