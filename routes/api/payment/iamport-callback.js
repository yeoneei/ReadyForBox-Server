var express = require('express');
var router = express.Router();

const responseMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const utils = require('../../../module/response/utils');
const pool = require('../../../config/dbConfig');
const axios = require('axios');


// 결제를 시도하는 라우팅
router.post('/schedule', async (req, res) => {
    try {
        console.log('웹훅 콜백 라우팅 코드 시작!!!');
        console.log('req다아아아아아아아아', req);

        var connection = await pool.getConnection();
        const { imp_uid, merchant_uid } = req.body;
        console.log('imp_유아이디 : ', imp_uid);
        console.log('merchant_유아이디 : ', merchant_uid);

        // 액세스 토큰(access token) 발급 받기
        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
                imp_key: process.env.IMP_KEY, // REST API키
                imp_secret: process.env.IMP_SECRET // REST API Secret
            }
        });
        const { access_token } = getToken.data.response; // 인증 토큰

        // imp_uid로 아임포트 서버에서 결제 정보 조회
        const getPaymentData = await axios({
          url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
          method: "get", // GET method
          headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });
        const paymentData = getPaymentData.data.response; // 조회한 결제 정보

        console.log('조회한 결제 정보(paymentData) : ', paymentData);
        const { status } = paymentData;
        // console.log('getPaymentData', getPaymentData);
        // console.log('paymentData', paymentData);
        console.log('status : ', status);


        if (status === "paid") {
            // DB에 결제 정보 저장
            // let query = "INSERT INTO "
            // let result = await connection.query(query, [subscribe, user_id]);
            // console.log("merchant_uid : ", merchant_uid);
            // console.log(paymentData); // 결제 정보
            
            // 다음 달 결제 예약하는 알고리즘
            const schedule_data = await axios({
                url: `https://api.iamport.kr/subscribe/payments/schedule`,
                method: "post",
                headers: { "Authorization": access_token }, // 인증 토큰 Authorization header에 추가
                data: {
                    customer_uid: "ababababab",
                    schedules: [
                        {
                            merchant_uid: 'md_' + new Date().getTime(),
                            schedule_at: new Date().getTime()/1000 + 240,
                            amount: 200,
                            name: '정기 결제 스케쥴링 아이템',
                        }
                    ]
                }
            });
            console.log('schedule_data.data : ', schedule_data.data);
        } else {
            res.send('재결제 시도해야 함!')
        }
        console.log('웹훅 콜백 라우팅 코드 완료!!!!');
    }
    catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
})

module.exports = router;