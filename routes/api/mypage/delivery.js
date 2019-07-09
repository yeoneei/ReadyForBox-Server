var express = require('express');
var router = express.Router();
const utils = require('../../../module/response/utils');
const resMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const pool = require('../../../config/dbConfig');
const jwt = require('../../../module/jwt');

router.get('/', jwt.isLoggedIn, async (req, res) => {
    try {
        var connection = await pool.getConnection();

        const { user_id } = req.decoded;
        const { order_id } = req.query;

        if (!user_id || !order_id) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else {

            let query = "SELECT * FROM orders WHERE user_id = ? AND order_id = ?"
            let result = await connection.query(query, [user_id, order_id]);
            if (!result[0]) {
                console.log("err")
                res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_PARAMS));
            } else {
                let data = {
                    receiver: result[0].receiver,
                    phone: result[0].phone,
                    address: result[0].delivery_address1 + ' ' + result[0].delivery_address2 + ' ' + result[0].delivery_address_detail,
                    delivery_memo: result[0].delivery_memo
                }
                res.status(200).json(utils.successTrue(statusCode.OK, resMessage.READ_SUCCESS, data));
            }
        }
    } catch (err) {
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
})
module.exports = router;