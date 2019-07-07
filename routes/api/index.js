var express = require('express');
var router = express.Router();

router.use('/product',require('./product'));
router.use('/mypage', require('./mypage'));
router.use('/auth', require('./auth'));
router.use('/payment', require('./payment'));
router.use('/users', require('./users'));

router.get('/test', function(req, res) {
    console.log('test창 테스트');
    res.render('test');
})

router.get('/', (req, res) => {
    res.redirect('http://13.209.206.99:3000/api/testaaaaa');
})

module.exports = router;
