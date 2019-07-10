var express = require('express');
var router = express.Router();
const utils = require('../../../module/response/utils');
const resMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const pool = require('../../../config/dbConfig');
const cryptoPassword = require('../../../module/cryptoPassword');

router.post('/', async(req, res) => {
    try {
        var connection = await pool.getConnection();
        await connection.beginTransaction();
        let { email, name, birth, phone, gender, address1, address2, address_detail, delivery_memo } = req.body;
        let { password } = req.body;

        // 테스트용 order_id(주문 번호)
        const order_id = new Date().getUTCMilliseconds();

        // Params나 Body값에 필수적으로 들어와야 하는 값이 들어오지 않은 경우
        if (!email || !name || !birth || !phone || !gender || !address1 || !address2 || !password) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else {
            // 이미 존재하는 아이디인지 체크하기 위한 쿼리
            let query = 'SELECT EXISTS (SELECT email FROM users WHERE email = ?) as isExist';
            var result = await connection.query(query, [email]);

            // 이미 존재하는 아이디가 있을 경우
            if (result[0].isExist == true) {
                res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ALREADY_USER))
            
            // 올바른 request를 보낸 경우
            } else {
                const salt = await cryptoPassword.salt();
                password = await cryptoPassword.hashedPassword(password, salt);

                // users에 회원 정보 데이터 삽입하는 쿼리
                if (!address_detail) {
                    address_detail = ""
                }
                if (!delivery_memo) {
                    delivery_memo = ""
                }
                query = 'INSERT INTO users '
                    + '(name, password, email, phone, address1, '
                    + 'address2, address_detail, birth, gender, salt) ' 
                    + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                const result_user = await connection.query(query, [name, password, email, phone, address1, address2, address_detail, birth, gender, salt]);
                const user_id = result_user.insertId
                
                // orders에 배송 정보 데이터 삽입하는 쿼리
                query = 'INSERT INTO orders '
                    + '(delivery_address1, delivery_address2, delivery_address_detail, delivery_memo, receiver, '
                    + 'phone, order_id, user_id) '
                    + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                await connection.query(query, [address1, address2, address_detail, delivery_memo, name, phone, order_id, user_id])
                
                await connection.commit();
                res.status(200).json(utils.successTrue(statusCode.CREATED, resMessage.SAVE_SUCCESS));
            }    
        }
    } catch(err) {
        connection.rollback();
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
});

module.exports = router;