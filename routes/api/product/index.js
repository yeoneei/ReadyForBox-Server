var express = require('express');
var router = express.Router();

router.use('/regular', require('./regular'));
router.use('/package', require('./package'));
router.use('/custom',require('./custom'));

module.exports = router;