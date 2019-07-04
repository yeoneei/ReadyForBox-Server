var express = require('express');
var router = express.Router();
const utils = require('../../../../module/response/utils');
const resMessage = require('../../../../module/response/responseMessage');
const statusCode = require('../../../../module/response/statusCode');
const pool = require('../../../../config/dbConfig');
const jwt = require('../../../../module/jwt');

// 배송 시 요청사항 변경
router.put('/', jwt.isLoggedIn, async (req, res) => {
    try {
        const { user_id } = req.decoded;
        console.log(user_id);

        var connection = await pool.getConnection();

        const { order_item_id, delivery_memo } = req.body;
        if (!order_item_id || !delivery_memo) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else {
            let query = "SELECT order_items.order_id FROM order_items left JOIN orders "
                + "ON order_items.order_id = orders.order_id WHERE order_item_id = ? AND user_id = ?";
            let result = await connection.query(query, [order_item_id, user_id]);
            console.log(result);
            if (!result[0]) {
                res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_PARAMS));
            } else {
                let query2 = "UPDATE orders SET delivery_memo = ? WHERE order_id = ?";
                let result2 = await connection.query(query2, [delivery_memo, result[0].order_id]);
                if (!result2) {
                    res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_PARAMS));
                } else {
                    res.status(200).json(utils.successTrue(statusCode.OK, resMessage.UPDATE_SUCCESS));
                }
            }
        }
    } catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    } finally {

        connection.release();
    }
})
module.exports = router;