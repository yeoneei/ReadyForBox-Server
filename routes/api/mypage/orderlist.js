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

        if (!user_id) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else {
            let query1 = "SELECT orders.created_at, main_img, name, "
            + "ROUND((1 - (sale_ratio * 0.01)) * price, 0) AS saled_price, "
            + "count, is_package "
            + "FROM order_items left JOIN orders ON order_items.order_id = orders.order_id "
            + "left JOIN products ON order_items.product_id = products.product_id WHERE user_id = ?";
            let result1 = await connection.query(query1, [user_id]);
            let data = result1;
            res.status(200).json(utils.successTrue(statusCode.OK, resMessage.READ_SUCCESS, data));
        }
    } catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
})

router.get('/detail', jwt.isLoggedIn, async (req, res) => {
    try {
        var connection = await pool.getConnection();
        const { user_id } = req.decoded;
        const { order_item_id } = req.query;
        
        if (!user_id || !order_item_id) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else {
            let query1 = "SELECT orders.created_at, main_img, name, "
                + "ROUND((1-(sale_ratio*0.01))*price,0) AS saled_price, "
                + "count, is_package, orders.order_id "
                + "FROM order_items left JOIN orders ON order_items.order_id = orders.order_id "
                + "left JOIN products ON order_items.product_id= products.product_id "
                + "WHERE order_item_id = ? AND user_id = ?";
            let result1 = await connection.query(query1, [order_item_id, user_id]);
            if (!result1[0]) {
                res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_PARAMS));
            } else {
                let data = result1;
                res.status(200).json(utils.successTrue(statusCode.OK, resMessage.READ_SUCCESS, data));
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