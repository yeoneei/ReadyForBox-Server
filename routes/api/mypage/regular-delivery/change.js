var express = require('express');
var router = express.Router();
const utils = require('../../../../module/response/utils');
const resMessage = require('../../../../module/response/responseMessage');
const statusCode = require('../../../../module/response/statusCode');
const pool = require('../../../../config/dbConfig');
const jwt = require('../../../../module/jwt');

router.get('/', jwt.isLoggedIn, async (req, res) => {
    try {
        var connection = await pool.getConnection();
        const { user_id } = req.decoded;
        const { order_item_id } = req.query;
        console.log(user_id);
        console.log(order_item_id);

        // 테스트용
        // order_id : tb_20191820192750
        // regular_delivery_id : 3
        // order_item_id : 3
        // user_id : 9
        let query1 = "SELECT main_img, name, "
            + "price * (1 - (0.01) * sale_ratio) AS saled_price, count, "
            + "delivery_address1, delivery_address2, delivery_address_detail, "
            + "delivery_memo, delivery_cycle, delivery_day FROM order_items "
            + "left JOIN regular_deliveries ON order_items.order_id = regular_deliveries.order_id "
            + "left JOIN orders ON order_items.order_id=orders.order_id "
            + "left JOIN products ON order_items.product_id=products.product_id "
            + "WHERE user_id = ? AND order_item_id = ?";
        let result1 = await connection.query(query1, [user_id, order_item_id]);

        const { main_img, name, saled_price, count, delivery_memo, 
            delivery_cycle, delivery_day, delivery_address_detail,
            delivery_address1, delivery_address2 } = result1[0];
        
        // console.log(result1[0]);
            
        if (delivery_address_detail == null) {
            var address = delivery_address1 + " " + delivery_address2;
        } else {
            var address = delivery_address1 + " " + delivery_address2 + " " + delivery_address_detail;
        }

        let data = {
            "product": {
                main_img,
                name,
                saled_price,
                count
            },
            "delivery": {
                address,
                delivery_memo
            },
            "cycle": {
                delivery_cycle,
                delivery_day
            }
        }
        res.status(200).json(utils.successTrue(statusCode.OK, resMessage.READ_SUCCESS, data));
    } catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
})

module.exports = router;