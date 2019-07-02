var express = require('express');
var router = express.Router();
const utils = require('../../../module/response/utils');
const resMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const pool = require('../../../config/dbConfig');

router.post('/', async(req, res) => {
    try {
        var connection = await pool.getConnection();
        const { email, password, name, birth, phone, gender } = req.body;
        
        
        
        res.status(200).json(utils.successTrue(statusCode.OK, resMessage.READ_SUCCESS, data));
    } catch(err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
});

module.exports = router;