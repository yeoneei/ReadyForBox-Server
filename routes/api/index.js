var express = require('express');
var router = express.Router();

router.use('/test', require('./test'));
router.use('/product',require('./product/index'));

module.exports = router;
