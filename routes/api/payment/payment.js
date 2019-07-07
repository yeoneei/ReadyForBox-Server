var express = require('express');
var router = express.Router();

const responseMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const utils = require('../../../module/response/utils');
const axios = require('axios');
const pool = require('../../../config/dbConfig');
const jwt = require('../../../module/jwt');

// 결제를 시도하는 라우팅
// router.get('/', jwt.isLoggedIn, async (req, res) => {  // jwt를 이용
router.get('/',  async (req, res) => { 
    try {
        var connection = await pool.getConnection();
        // const { user_id } = req.decoded; // jwt를 이용
        const user_id = 9; // 테스트용

        let query1 = "SELECT user_id, name, email, phone, "
                + "concat(address1, ' ', address2, ' ', IFNULL(address_detail, '')) AS address, "
                + "birth, gender "
                + "FROM users WHERE user_id = ?";
        let result1 = await connection.query(query1, [user_id]);
        const user = result1[0];
        console.log(user);

        // billings.js에 보낼 데이터 (실제 결제할 여러 상품을 종합한 정보)
        // : 몽고 DB를 이용해서 조회해야 함.
        // 1. 여러 개의 상품을 더한 총 가격 (amount)
        // 2. 여러 개의 상품을 합한 이름 (name)
        // -> 삼다수 40ml, 500개입 외 3개  
        // -> 상품이 1개일 경우 : { 첫 번째 상품 }
        //    상품이 2개 이상일 경우 : { 첫 번째 상품 } 외 { 주문할 상품 총 개수 - 1}개

        // test용
        const order = { 'amount': 100, 'name': '삼다수 40ml, 5개입 외 3개'}
        
        res.render('payment', { user, order });
    }
    catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
})

module.exports = router;