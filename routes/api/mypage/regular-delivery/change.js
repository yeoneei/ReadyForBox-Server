var express = require('express');
var router = express.Router();
const utils = require('../../../../module/response/utils');
const resMessage = require('../../../../module/response/responseMessage');
const statusCode = require('../../../../module/response/statusCode');
const pool = require('../../../../config/dbConfig');
const jwt = require('../../../../module/jwt');

let data = {}
router.get('/', async (req, res) => {
    try {
        var connection = await pool.getConnection();
        const { order_item_id } = req.query;
        let query1 = "SELECT * FROM order_items left JOIN regular_deliveries ON order_items.order_id = regular_deliveries.order_id left JOIN orders ON order_items.order_id=orders.order_id left JOIN products ON order_items.product_id = products.product_id WHERE user_id=1 AND order_item_id=?";
        let result1 = await connection.query(query1, [order_item_id]);
        delete result1.meta;
        //console.log(result1);

        let product = {
            main_img: result1[0].main_img,
            name: result1[0].name,
            saled_price: Math.round(result1[0].price * (1 - (0.01) * result1[0].sale_ratio)),
            count: result1[0].count
        }
        if (result1[0].delivery_address_detail == null) {
            var address = result1[0].delivery_address1 + " " + result1[0].delivery_address2;
        } else {
            var address = result1[0].delivery_address1 + " " + result1[0].delivery_address2 + " " + result1[0].delivery_address_detail
        }

        let delivery = {
            address: address,
            delivery_memo: result1[0].delivery_memo
        }
        let cycle = {
            delivery_cycle: result1[0].delivery_cycle,
            delivery_day: result1[0].delivery_day
        }
        //console.log(product);
        //console.log(delivery);
        //console.log(cycle);

        data.product = product;
        data.delivery = delivery;
        data.cycle = cycle;

        console.log(data);
    } catch {

    }
})
module.exports = router;