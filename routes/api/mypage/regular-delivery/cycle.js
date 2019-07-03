var express = require('express');
var router = express.Router();
const utils = require('../../../../module/response/utils');
const resMessage = require('../../../../module/response/responseMessage');
const statusCode = require('../../../../module/response/statusCode');
const pool = require('../../../../config/dbConfig');
const jwt = require('../../../../module/jwt');

// 배송 주기 변경

router.put('/', async (req, res) => {
    try {
        var connection = await pool.getConnection();

        const { order_item_id, delivery_cycle } = req.body;

        if (!order_item_id || !delivery_cycle) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else {

            let query = "SELECT order_id FROM order_items WHERE order_item_id = ?";
            let result = await connection.query(query, [order_item_id]);

            if (!result[0]) {
                res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_PARAMS));
            } else {
                let query2 = "UPDATE regular_deliveries SET delivery_cycle = ? WHERE order_id = ?";
                let result2 = await connection.query(query2, [delivery_cycle, result[0].order_id]);

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