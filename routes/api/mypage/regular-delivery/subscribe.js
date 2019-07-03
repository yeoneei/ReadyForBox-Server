var express = require('express');
var router = express.Router();
const utils = require('../../../../module/response/utils');
const resMessage = require('../../../../module/response/responseMessage');
const statusCode = require('../../../../module/response/statusCode');
const pool = require('../../../../config/dbConfig');
const jwt = require('../../../../module/jwt');

// 마이페이지 정기배송 관리 - 신청,해지 내역

router.get('/', async (req, res) => {
    try {
        var connection = await pool.getConnection();

        const { is_subscribed } = req.query;

        if (!is_subscribed) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        } else {

            let query = "SELECT main_img, name, delivery_cycle, delivery_day, count "
                + "FROM order_items left JOIN regular_deliveries ON order_items.order_id = regular_deliveries.order_id "
                + "left JOIN products ON order_items.product_id = products.product_id WHERE is_subscribed = ?"

            let data = await connection.query(query, [is_subscribed]);

            if (!data) {
                res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
            } else {
                res.status(200).json(utils.successTrue(statusCode.OK, responseMessage.READ_SUCCESS, data));
            }
        }

    } catch (err) {
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
})
module.exports = router;
