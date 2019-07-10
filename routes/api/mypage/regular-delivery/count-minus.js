var express = require('express');
var router = express.Router();
const utils = require('../../../../module/response/utils');
const resMessage = require('../../../../module/response/responseMessage');
const statusCode = require('../../../../module/response/statusCode');
const pool = require('../../../../config/dbConfig');
const jwt = require('../../../../module/jwt');

// 정기배송 관리 - 수량 감소
router.put('/', jwt.isLoggedIn, async (req, res) => {
    try {
        var connection = await pool.getConnection();
        const { order_id, product_id } = req.body;
        const { user_id } = req.decoded;

        if (!order_id || !user_id || !product_id) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else {
            let query1 = "SELECT count FROM orders "
                + "LEFT JOIN orders_products ON orders.order_id = orders_products.order_id "
                + "LEFT JOIN products ON orders_products.product_id = products.product_id "
                + "WHERE orders.order_id = ? AND user_id = ? AND products.product_id = ?"
            let result1 = await connection.query(query1, [order_id, user_id, product_id]);
            console.log(result1[0]);
            if (!result1[0]) {
                res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_PARAMS));
            } else {
                const { count } = result1[0];

                // 수량이 1개일 때는 감소 시킬 수 없다.
                if (count > 1) {
                    let query2 = "UPDATE products SET count = count - 1 WHERE product_id = ?"
                    let result2 = await connection.query(query2, [product_id]);
                    if (result2.affectedRows === 1) {
                        res.status(200).json(utils.successTrue(statusCode.NO_CONTENT, resMessage.UPDATE_SUCCESS));
                    } else {
                        res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_PARAMS));
                    }
                } else {
                    res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.MINIMUM));
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