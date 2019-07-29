var express = require('express');
var router = express.Router();

const responseMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const utils = require('../../../module/response/utils');
const pool = require('../../../config/dbConfig');
const jwt = require('../../../module/jwt');
const axios = require('axios');


router.get('/',  async (req, res) => { 
    try {
        console.log('테스트 시작');

        const response = await axios({
            method: 'post',
            url: 'https://kapi.kakao.com/v1/payment/ready',
            headers: { 
                'Authorization': process.env.KAKAO_DEVELOPERS_ADMIN,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                cid: '',
                approval_url: 'http://localhost:3000/api/approval',
                cancel_url: 'http://localhost:3000/api/cancel',
                fail_url: 'http://localhost:3000/api/fail'
            }
        });


        // console.log(response);
        console.log('테스트 끝');
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;