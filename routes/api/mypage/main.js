var express = require('express');
var router = express.Router();
const utils = require('../../../module/response/utils');
const resMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const pool = require('../../../config/dbConfig');
const jwt = require('../../../module/jwt');

router.get('/', jwt.isLoggedIn, async(req, res) => {
    try {
        const { name, email } = req.decoded;
        const data = {
            name,
            email
        };
        res.status(200).json(utils.successTrue(statusCode.OK, resMessage.READ_SUCCESS, data));
    } catch(err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    }
})

module.exports = router;