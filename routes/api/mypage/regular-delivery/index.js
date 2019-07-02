var express = require('express');
var router = express.Router();

router.use('/product', require('./product'));

module.exports = router;