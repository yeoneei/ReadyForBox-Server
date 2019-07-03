var express = require('express');
var router = express.Router();
const utils = require('../../../module/response/utils');
const resMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const pool = require('../../../config/dbConfig');
const cryptoPassword = require('../../../module/cryptoPassword');
const jwt = require('../../../module/jwt');

router.post('/', async(req, res) => {
    try {
        var connection = await pool.getConnection();
        const { email } = req.body;
        let { password } = req.body;

        // Params나 Body값에 필수적으로 들어와야 하는 값이 들어오지 않은 경우
        if (!email || !password) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else {
            // users의 user_id, email, name 정보 불러오기
            let query = 'SELECT user_id, email, name, salt, password FROM users WHERE email = ?';
            let result = await connection.query(query, [email]);
        
            // 존재하지 않는 아이디의 경우
            if (!result[0]) {
                res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_USER));

            // 패스워드가 일치하지 않는 경우
            } else {
                salt = result[0].salt;
                const db_password = result[0].password;
                password = await cryptoPassword.hashedPassword(password, salt);  
                if (password !== db_password) {
                    res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.INVALID_PASSWORD));

                // 패스워드가 일치하는 경우 -> 로그인 성공
                } else {
                    let data = {
                        token: jwt.sign(result[0])
                    };
                    res.status(200).json(utils.successTrue(statusCode.OK, resMessage.LOGIN_SUCCESS, data));
                }
            }
        }        
    } catch(err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
});

module.exports = router;