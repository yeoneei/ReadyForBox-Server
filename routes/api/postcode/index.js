var express = require('express');
var router = express.Router();

router.use('/', require('./postcode'));

module.exports = router;
