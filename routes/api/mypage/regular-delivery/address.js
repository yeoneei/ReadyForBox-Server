var express = require('express');
var router = express.Router();
const utils = require('../../../../module/response/utils');
const resMessage = require('../../../../module/response/responseMessage');
const statusCode = require('../../../../module/response/statusCode');
const pool = require('../../../../config/dbConfig');
const jwt = require('../../../../module/jwt');

// 배송주소 변경

router.put('/', async (req, res) => {
    try {
        var connection = await pool.getConnection();

        var { delivery_address1, delivery_address2, delivery_address_detail, order_item_id, } = req.body;

        if (!delivery_address1 || !delivery_address2) {

        } else {
            if (delivery_address_detail === undefined) {
                delivery_address_detail = " ";
            }
            let query1 = "UPDATE order_items left JOIN orders ON order_items.order_id=orders.order_id SET delivery_address1 = ? , delivery_address2 = ?, delivery_address_detail=? WHERE user_id=1 AND order_item_id=?"
            let result1 = await connection.query(query1, [delivery_address1, delivery_address2, delivery_address_detail, order_item_id]);
            console.log(result1);
        }
    } catch {
        console.log("error!");
    } finally {
        connection.release();
    }

})

module.exports = router;