var express = require('express');
var router = express.Router();
const responseMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const utils = require('../../../module/response/utils');
const pool = require('../../../config/dbConfig');

// 정기 배송 상품 리스트 보여주기
router.get('/', async (req, res) => {
    try {
        var connection = await pool.getConnection();
        const { main_category_id, flag } = req.query;
        let data = {
            product_count: null,
            product: null
        };

        if (!main_category_id || !flag) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        } else {
            // 각각의 정렬 방법에 따른 데이터 조회
            if (flag == 3) {
                let query1 = "SELECT product_id, main_img, name, content, price, "
                    + "ROUND((1-(sale_ratio*0.01))*price, 0) AS saled_price "
                    + "FROM products WHERE main_category_id=? AND is_package = 0 ORDER BY saled_price ASC";
                let result1 = await connection.query(query1, [main_category_id]);

                if (!result1[0]) {
                    res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.WRONG_PARAMS));
                } else {
                    data.product = result1;
                }
            } else if (flag == 4) {
                let query2 = "SELECT product_id, main_img, name, content, price, "
                    + "ROUND((1-(sale_ratio*0.01))*price, 0) AS saled_price "
                    + "FROM products WHERE main_category_id=? AND is_package = 0 ORDER BY saled_price DESC";
                let result2 = await connection.query(query2, [main_category_id]);
                if (!result2[0]) {
                    res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.WRONG_PARAMS));
                } else {
                    data.product = result2;
                }
            } else {
                res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.WRONG_PARAMS));
            };

            // 조회된 상품의 개수
            let query3 = "SELECT COUNT(*) AS product_count FROM products WHERE main_category_id=?";
            let result3 = await connection.query(query3, [main_category_id]);
            if (!result3) {
                res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.WRONG_PARAMS));
            } else {
                data.product_count = result3[0].product_count;
            }
            
            res.status(200).json(utils.successTrue(statusCode.OK, responseMessage.READ_SUCCESS, data));
        }
    } catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
})

module.exports = router;