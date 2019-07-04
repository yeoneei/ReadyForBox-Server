var express = require('express');
var router = express.Router();
const utils = require('../../../../module/response/utils');
const resMessage = require('../../../../module/response/responseMessage');
const statusCode = require('../../../../module/response/statusCode');
const pool = require('../../../../config/dbConfig');
const jwt = require('../../../../module/jwt');

// 정기 배송 취소
router.put('/', jwt.isLoggedIn, async (req, res) => {
    try {
        var connection = await pool.getConnection();
        const { user_id } = req.decoded;
        const { order_item_id } = req.body;

        if (!order_item_id || !user_id) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else {
            let query = "SELECT order_items.order_id, is_subscribed FROM order_items "
                + "LEFT JOIN orders ON order_items.order_id = orders.order_id "
                + "LEFT JOIN regular_deliveries ON orders.order_id = regular_deliveries.order_id "
                + "WHERE order_item_id = ? AND user_id = ?";
            let result = await connection.query(query, [order_item_id, user_id]);


            if (!result[0]) {
                res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_PARAMS));
            } else {
                const { order_id, is_subscribed } = result[0];

                if (is_subscribed === 1) {    
                    let query2 = "UPDATE regular_deliveries SET is_subscribed = 0 WHERE order_id = ?";
                    let result2 = await connection.query(query2, [order_id]);
    
                    if (result2.affectedRows === 1) {
                        res.status(200).json(utils.successTrue(statusCode.NO_CONTENT, resMessage.UPDATE_SUCCESS));
                    } else {
                        res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_PARAMS));
                    }
                } else if (is_subscribed === 0) {
                    res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ALREADY_CANCEL));
                } else {
                    res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
                }
            };
        }
    } catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
})
module.exports = router;