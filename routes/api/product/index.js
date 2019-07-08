var express = require('express');
var router = express.Router();



router.use('/custom', require('./custom'));
router.use('/regular/detail', require('./regular_detail'));
router.use('/package/detail', require('./package_detail'));


// api Ver 2.0
router.use('/regular', require('./regular'));
router.use('/package', require('./package'));

module.exports = router;