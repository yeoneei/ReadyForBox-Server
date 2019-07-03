var express = require('express');
var router = express.Router();

router.use('/product', require('./product'));
router.use('/change', require('./change'));
router.use('/change/address', require('./address'));
router.use('/change/count-minus', require('./count-minus'));
module.exports = router;