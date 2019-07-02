var express = require('express');
var router = express.Router();

router.use('/test', require('./test'));
router.use('/product',require('./product'));
router.use('/mypage', require('./mypage'));

module.exports = router;
