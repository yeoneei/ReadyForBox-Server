var express = require('express');
var router = express.Router();

router.use('/regular', require('./regular'));

module.exports = router;