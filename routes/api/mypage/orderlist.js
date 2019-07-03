var express = require('express');
var router = express.Router();
const utils = require('../../../module/response/utils');
const resMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const pool = require('../../../config/dbConfig');
const jwt = require('../../../module/jwt');

router.get('/', async (req, res) => {
    try {
        var connection = await pool.getConnection();
        //const { user_id } = req.decoded;


        let query1 = "SELECT orders.created_at,main_img,name,ROUND((1-(sale_ratio*0.01))*price,0) AS saled_price,count,is_package FROM order_items left JOIN orders ON order_items.order_id=orders.order_id left JOIN products ON order_items.product_id= products.product_id WHERE user_id=1";
        let result1 = await connection.query(query1);
        delete result1.meta;
        let data = result1;
        console.log(data);

    } catch {

    } finally {
        connection.release();
    }

})

router.get('/detail', async (req, res) => {
    try {
        var connection = await pool.getConnection();
        //const { user_id } = req.decoded;

        const { order_item_id } = req.query;

        let query1 = "SELECT orders.created_at,main_img,name,ROUND((1-(sale_ratio*0.01))*price,0) AS saled_price,count,is_package,orders.order_id FROM order_items left JOIN orders ON order_items.order_id=orders.order_id left JOIN products ON order_items.product_id= products.product_id WHERE order_item_id=? AND user_id=1";
        let result1 = await connection.query(query1, [order_item_id]);
        delete result1.meta;
        let data = result1;
        console.log(data);

    } catch {

    } finally {
        connection.release();
    }
})

module.exports = router;