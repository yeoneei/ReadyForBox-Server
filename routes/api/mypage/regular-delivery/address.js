var express = require('express');
var router = express.Router();
const utils = require('../../../../module/response/utils');
const resMessage = require('../../../../module/response/responseMessage');
const statusCode = require('../../../../module/response/statusCode');
const pool = require('../../../../config/dbConfig');
const jwt = require('../../../../module/jwt');

// 배송주소 변경

router.put('/', jwt.isLoggedIn, async (req, res) => {
    try {
        var connection = await pool.getConnection();
        const { user_id } = req.decoded;
        const { delivery_address1, delivery_address2, order_id } = req.body;
        let { delivery_address_detail } = req.body;

        if (!delivery_address1 || !delivery_address2 || !order_id) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else {
            if (delivery_address_detail === undefined) {
                delivery_address_detail = '';
            }
            let query = "UPDATE orders SET delivery_address1 = ? , delivery_address2 = ?, delivery_address_detail = ? "
                + "WHERE user_id = ? AND order_id = ?"
            let result = await connection.query(query, [delivery_address1, delivery_address2, delivery_address_detail, user_id, order_id]);
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