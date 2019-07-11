var express = require('express');
var router = express.Router();

const responseMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const utils = require('../../../module/response/utils');
const axios = require('axios');
const pool = require('../../../config/dbConfig');
const jwt = require('../../../module/jwt');

// 카드 등록이 된 상태에서 '결제하기' 버튼을 눌렀을 때
router.post('/', jwt.isLoggedIn, async (req, res) => {
    try {
        var connection = await pool.getConnection();
        await connection.beginTransaction();
        
        // 주문번호(order_id) 생성
        const merchant_uid = 'md_' + new Date().getTime(); // (= order_id)
        let { delivery_address1, delivery_address2, delivery_address_detail, delivery_memo, 
            phone, receiver, product, customer_uid, amount, product1_name } = req.body;
        
        const { user_id } = req.decoded;
        if (!delivery_address_detail) {
            delivery_address_detail = "";
        }
        if (!delivery_memo) {
            delivery_memo = "";
        }
        
        // 주문 정보 데이터 삽입
        let query = 'INSERT INTO orders '
            + '(order_id, delivery_address1, delivery_address2, delivery_address_detail, delivery_memo, '
            + 'phone, receiver, user_id) '
            + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        let result = await connection.query(query, [merchant_uid, delivery_address1, delivery_address2, delivery_address_detail,
            delivery_memo, phone, receiver, user_id]);
        console.log(result);

        
        
        for (let i = 0; i < product.length; i++) {
            // 주문 정보에서의 주문한 상품들 데이터 삽입
            let query2 = 'INSERT INTO products (product_id, count, delivery_day, delivery_cycle) VALUES (?, ?, ?, ?)';
            let result2 = await connection.query(query2, [product[i].product_id, product[i].count, product[i].delivery_day, product[i].delivery_cycle]);
            console.log(result2);
            let id = result2.insertId;

            // 주문 정보 데이터와 주문 상품들을 이어주는 M:N 관계를 이어주기
            let query3 = 'INSERT INTO orders_products (order_id, id) VALUES (?, ?)';
            let result3 = await connection.query(query3, [merchant_uid, id]);
            console.log(result3);
        };

        /////////////// 결제 요청을 위한 인증 토큰 발급 받기
        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
              imp_key: process.env.IMP_KEY, // REST API키 (대시보드에 나와있음)
              imp_secret: process.env.IMP_SECRET // REST API Secret (대시보드에 나와있음)
            }
        });

        const { access_token } = getToken.data.response; // 인증 토큰

        
        let order_name;
        if (product.length == 1) {
            order_name = product1_name;
        } else if (product.length > 1) {
            order_name = product1_name + ' 외 ' + (product.length - 1) + '개';
        }
        
        
        ////////////// 결제(재결제) 요청
        const paymentResult = await axios({
            url: 'https://api.iamport.kr/subscribe/payments/again',
            method: "post",
            headers: { "Authorization": access_token }, // 인증 토큰 Authorization header에 추가
            // 요청하고자 하는 결제 정보
            data: {
                customer_uid, 
                merchant_uid, // 새로 생성한 결제(재결제)용 주문 번호
                amount, 
                name: order_name,
                // notice_url: process.env.IAMPORT_CALLBACK_SCHEDULE_NOTICE_URL
                // notice_url: 'http://13.209.206.99:3000/api/payment/iamport-callback/schedule'
            }
        });
        
        // console.log('paymentResult', paymentResult);
        

        /////////////// 카드 정상 승인
        const { code, message } = paymentResult.data;
        if (code === 0) { // 카드사 통신에 성공(실제 승인 성공 여부는 추가 판단이 필요합니다.)
            const { status } = paymentResult.data.response;
            console.log('status : ', status);
            if ( status === "paid" ) { // 카드 정상 승인
                console.log('카드 정상 승인');
                res.status(200).json(utils.successTrue(statusCode.OK, responseMessage.APPROVAL_SUCCESS));
            } else { // 카드 승인 실패 (ex. 고객 카드 한도초과, 거래정지카드, 잔액부족 등)
              //paymentResult.status : failed 로 수신됩니다.
                console.log('카드 승인 실패');
                res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.APPROVAL_FAIL));
            }
        } else { // 카드사 요청에 실패 (paymentResult is null)
            console.log('카드사 요청에 실패');
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.APPROVAL_FAIL));
        }

        await connection.commit();
        console.log('카드 등록 이후에 결제하기(card-payment.js) 라우팅 전체 코드 실행 완료!');
    }
    catch (err) {
        connection.rollback();
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
})

module.exports = router;