var express = require('express');
var router = express.Router();

const responseMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const utils = require('../../../module/response/utils');
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

        
        // 카드 등록창을 띄워주는 card-enrollment.ejs를 불러줌. 
        res.render('card-enrollment', { user });
    }
    catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
})

////////// 카드를 등록하는 라우팅
router.post('/', async (req, res) => {
    try {
        var connection = await pool.getConnection();

        console.log('user 테이블의 특정 user에 customer_uid를 저장하기 시작');
        const { customer_uid, user_id } = req.body;
        console.log('req의 바디값 : ', req.body)

        let query = 'UPDATE users SET customer_uid = ? WHERE user_id = ?';
        let result = await connection.query(query, [customer_uid, user_id]);
        console.log('리절트(result) 값 : ', result);
        console.log('user 테이블의 특정 user에 customer_uid를 저장하기 완료');

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