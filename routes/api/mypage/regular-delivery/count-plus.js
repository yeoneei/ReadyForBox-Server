var express = require('express');
var router = express.Router();
const utils = require('../../../../module/response/utils');
const resMessage = require('../../../../module/response/responseMessage');
const statusCode = require('../../../../module/response/statusCode');
const pool = require('../../../../config/dbConfig');
const jwt = require('../../../../module/jwt');

// 정기배송 관리 - 수량 증가
router.put('/', jwt.isLoggedIn, async (req, res) => {
    try {
        var connection = await pool.getConnection();
        const { order_item_id } = req.body;
        const { user_id } = req.decoded;

        if (!order_item_id || !user_id) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else {
            let query1 = "SELECT count FROM order_items "
            + "LEFT JOIN orders ON order_items.order_id = orders.order_id "
            + "WHERE order_item_id = ? AND user_id = ?"
            let result1 = await connection.query(query1, [order_item_id, user_id]);    
            if (!result1[0]) {
                res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_PARAMS));
            } else {
                const { count } = result1[0];
                // 수량은 99개까지 증가 가능
                if (count >= 1 && count < 99) {
                    let query2 = "UPDATE order_items SET count = count + 1 WHERE order_item_id = ?"
                    let result2 = await connection.query(query2, [order_item_id]);
                    if (result2.affectedRows === 1) {
                        res.status(200).json(utils.successTrue(statusCode.NO_CONTENT, resMessage.UPDATE_SUCCESS));
                    } else {
                        res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_PARAMS));
                    }
                } else {
                    res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.MAXIMUM));
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