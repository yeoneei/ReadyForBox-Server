var express = require('express');
var router = express.Router();
const utils = require('../../../../module/response/utils');
const resMessage = require('../../../../module/response/responseMessage');
const statusCode = require('../../../../module/response/statusCode');
const pool = require('../../../../config/dbConfig');
const jwt = require('../../../../module/jwt');

// 마이페이지 정기관리 - 상품확인
router.get('/', /*jwt.isLoggedIn,*/ async(req,res)=>{
    var connection = await pool.getConnection();
    //const { name } = req.decoded;

    let query1 = "SELECT main_img,name,delivery_cycle,delivery_day FROM order_items left JOIN regular_deliveries ON order_items.order_id = regular_deliveries.order_id left JOIN orders ON order_items.order_id=orders.order_id left JOIN products ON order_items.product_id = products.product_id WHERE user_id=1";
    let result1 = await connection.query(query1);
    delete result1.meta;
    console.log(result1);
})

module.exports = router;