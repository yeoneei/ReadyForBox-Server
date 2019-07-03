var express = require('express');
var router = express.Router();
const utils = require('../../../../module/response/utils');
const resMessage = require('../../../../module/response/responseMessage');
const statusCode = require('../../../../module/response/statusCode');
const pool = require('../../../../config/dbConfig');
const jwt = require('../../../../module/jwt');

// 정기 배송 취소

router.put('/', async (req, res) => {
    try {
        var connection = await pool.getConnection();

        const { order_item_id } = req.body;

        if (!order_item_id) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else {

            let query = "SELECT order_id FROM order_items WHERE order_item_id = ?";
            let result = await connection.query(query, [order_item_id]);

            if (!result[0]) {
                res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_PARAMS));
            } else if (is_subscribed = 1) {
                let query2 = "UPDATE regular_deliveries SET is_subscribed = 0 WHERE order_id = ?";
                let result2 = await connection.query(query2, [result[0].order_id]);

                if (!result2[0]) {
                    res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_PARAMS));
                } else {
                    res.status(200).json(utils.successTrue(statusCode.OK, resMessage.UPDATE_SUCCESS));
                }
            }
        }
    } catch (err) {
        console.log(err);
    } finally {
        connection.release();
    }
})
module.exports = router;