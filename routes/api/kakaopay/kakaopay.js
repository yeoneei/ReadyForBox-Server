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

        res.render('kakaopay', { user });
    }
    catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
})

module.exports = router;