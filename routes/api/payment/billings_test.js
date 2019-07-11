var express = require('express');
var router = express.Router();

const responseMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const utils = require('../../../module/response/utils');
const axios = require('axios');
const pool = require('../../../config/dbConfig');

////////// 카드를 등록하는 라우팅
router.post('/', async (req, res) => {
    try {
        const { customer_uid } = req.body;

        var connection = await pool.getConnection();
        let query = 'INSERT INTO users (customer_uid) VALUES (?)';
        let result = await connection.query(query, [customer_uid]);

        console.log('빌링(billings.js) 라우팅 시작!');
        // console.log(req.body);
        const { customer_uid, order_amount, order_name } = req.body; // req의 body에서 customer_uid 추출
        console.log('customer_uid : ', customer_uid);
        console.log('총 주문 결제 정보 : ', order_amount, order_name);

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
        
        ////////////// 결제(재결제) 요청
        const paymentResult = await axios({
            url: 'https://api.iamport.kr/subscribe/payments/again',
            method: "post",
            headers: { "Authorization": access_token }, // 인증 토큰 Authorization header에 추가
            // 요청하고자 하는 결제 정보
            data: {
                customer_uid, 
                merchant_uid: 'md_' + new Date().getTime(), // 새로 생성한 결제(재결제)용 주문 번호
                amount: order_amount, 
                name: order_name, 
                // notice_url: process.env.IAMPORT_CALLBACK_SCHEDULE_NOTICE_URL
                notice_url: 'http://13.209.206.99:3000/api/payment/iamport-callback/schedule'
            }
        });
        
        // console.log('paymentResult', paymentResult);
        

        /////////////// 카드 정상 승인
        // console.log('paymentResult.data', paymentResult.data);
        const { code, message } = paymentResult.data;
        
        if (code === 0) { // 카드사 통신에 성공(실제 승인 성공 여부는 추가 판단이 필요합니다.)
            const { status } = paymentResult.data.response;
            console.log('status : ', status);
            if ( status === "paid" ) { // 카드 정상 승인
                console.log('카드 정상 승인');
                // res.status(200).send('성공');
            } else { // 카드 승인 실패 (ex. 고객 카드 한도초과, 거래정지카드, 잔액부족 등)
              //paymentResult.status : failed 로 수신됩니다.
                console.log('카드 승인 실패');
                // res.status(200).send('실패');
            }
            // res.send({ });
        } else { // 카드사 요청에 실패 (paymentResult is null)
            console.log('카드사 요청에 실패');
            // res.status(200).send('실패');
        }

        // 결제 예약
        axios({
            url: `https://api.iamport.kr/subscribe/payments/schedule`,
            method: "post",
            headers: { "Authorization": access_token }, // 인증 토큰 Authorization header에 추가
            data: {
            customer_uid: "gildong_0001_1234", // 카드(빌링키)와 1:1로 대응하는 값
            schedules: [
                {
                merchant_uid: 'md_' + new Date().getTime(), // 주문 번호
                schedule_at: new Date().getTime()/1000 + 300, // 결제 시도 시각 in Unix Time Stamp. ex. 다음 달 1일
                amount: 200,
                name: "월간 이용권 정기결제",
                buyer_name: "홍길동",
                buyer_tel: "01012345678",
                buyer_email: "gildong@gmail.com"
                }
            ]
            }
        });
        console.log('빌링(billings.js) 라우팅 전체 코드 실행 완료!');
    }
    catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
})

module.exports = router;