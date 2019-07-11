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
        //    상품이 2개 이상일 경우 : { 첫 번째 상품 } 외 { 주문할 상품 총 개수 - 1} 개

        // 클라한테 장바구니(결제) 페이지에서 받아야 하는 값
        // amount : 총 상품 가격
        // product1_name : 첫 번째 상품 이름
        // product_count : 상품 종류 개수
        const { amount, product1_name, product_species_count } = req.query;
        
        let temp_name;
        if (product_species_count == 1) {
            temp_name = product1_name;
        } else if (product_species_count > 1) {
            temp_name = product1_name + ' 외 ' + (product_species_count - 1) + '개';
        }
        
        // const order = { 
        //     amount, 
        //     name: temp_name,
        // }

        // 테스트용
        const order = {
            amount: 100,
            name: "테스트용"
        }
        
        // 결제 창을 띄워주는 payment.ejs를 불러줌. 
        res.render('payment_test', { user, order });
    }
    catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
})

module.exports = router;