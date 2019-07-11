var express = require('express');
var router = express.Router();
const utils = require('../../../../module/response/utils');
const resMessage = require('../../../../module/response/responseMessage');
const statusCode = require('../../../../module/response/statusCode');
const pool = require('../../../../config/dbConfig');
const jwt = require('../../../../module/jwt');

// 배송 일자 변경
router.put('/', jwt.isLoggedIn, async (req, res) => {
    try {
        var connection = await pool.getConnection();
        const { user_id } = req.decoded;
        const { order_id, product_id, delivery_day } = req.body;

        if (!order_id || !delivery_day || !user_id) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else if (delivery_day < 1 || delivery_day > 31) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_DAY));
        } else {
            let query = "UPDATE products LEFT JOIN orders_products "
                + "ON products.id = orders_products.id LEFT JOIN orders "
                + "ON orders_products.order_id = orders.order_id SET delivery_day = ? "
                + "WHERE products.product_id = ? AND orders.order_id = ? AND user_id = ?";
            let result = await connection.query(query, [delivery_day, product_id, order_id, user_id]);
            if (result.affectedRows === 1) {
                res.status(200).json(utils.successTrue(statusCode.NO_CONTENT, resMessage.UPDATE_SUCCESS));
            } else {
                res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_PARAMS));
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