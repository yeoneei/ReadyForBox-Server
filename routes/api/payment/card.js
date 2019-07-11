var express = require('express');
var router = express.Router();

const responseMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const utils = require('../../../module/response/utils');
const axios = require('axios');
const pool = require('../../../config/dbConfig');
const jwt = require('../../../module/jwt');

// card 정보 조회하는 라우팅
router.get('/', jwt.isLoggedIn, async (req, res) => {  // jwt를 이용
    try {
        var connection = await pool.getConnection();
        const { user_id } = req.decoded; // jwt를 이용

        let query1 = "SELECT customer_uid FROM users WHERE user_id = ?"
        let result1 = await connection.query(query1, [user_id]);
        const user = result1[0];
        const { customer_uid } = user

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
        const getCardData = await axios({
          url: `https://api.iamport.kr/subscribe/customers/${customer_uid}`, // imp_uid 전달
          method: "get", // GET method
          headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });
        const cardData = getCardData.data.response; // 조회한 결제 정보
        res.status(200).json(utils.successTrue(statusCode.OK, responseMessage.READ_SUCCESS, cardData));
    }
    catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
})

module.exports = router;