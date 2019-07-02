var express = require('express');
var router = express.Router();

router.use('/product', require('./product'));
router.use('/change', require('./change'));

module.exports = router;