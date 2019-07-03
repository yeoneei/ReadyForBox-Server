var express = require('express');
var router = express.Router();
const utils = require('../../../../module/response/utils');
const resMessage = require('../../../../module/response/responseMessage');
const statusCode = require('../../../../module/response/statusCode');
const pool = require('../../../../config/dbConfig');
const jwt = require('../../../../module/jwt');

// 정기배송 관리 - 수량 증가
router.put('/', async (req, res) => {
    try {
        var connection = await pool.getConnection();

        const { order_item_id } = req.body;

        let query1 = "SELECT count FROM order_items WHERE order_item_id = ? "
        let result1 = await connection.query(query1, [order_item_id]);

        // 수량은 99개까지 증가 가능
        if ((result1[0].count) >= 1 && (result1[0].count) < 99) {
            let query2 = "UPDATE order_items SET count=count+1 WHERE order_item_id = ?"
            let result2 = await connection.query(query2, [order_item_id]);
            console.log(result2);
        } else {
            console.log("최대 수량입니다.");
        }
    } catch (err) {
        console.log(err);
    } finally {
        connection.release();
    }
})
module.exports = router;