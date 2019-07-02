var express = require('express');
var router = express.Router();

const responseMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const utils = require('../../../module/response/utils');
const pool = require('../../../config/dbConfig');

let data = {
    product_count: null,
    product: null
}

// 정기 배송 상품 리스트 보여주기

router.get('/', async (req, res) => {
    try {

        var connection = await pool.getConnection();

        const { main_category_id, flag } = req.query;
        if (!main_category_id || !flag) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.WRONG_PARAMS));
        } else {
            // 최신순
            if(flag == 2) {
                let query = "SELECT main_img,name,content,price,ROUND((1-(sale_ratio*0.01))*price,0) AS saled_price FROM products WHERE main_category_id=? AND is_package = 0 ORDER BY created_at DESC";
                let result = await connection.query(query, [main_category_id]);
                if (!result[0]) {
                    res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.WRONG_PARAMS));
                } else {
                    delete result.meta;
                    data.product = result;
                }
            }
            // 가격 낮은 순
            else if (flag == 3) {
                let query1 = "SELECT main_img,name,content,price,ROUND((1-(sale_ratio*0.01))*price,0) AS saled_price FROM products WHERE main_category_id=? AND is_package = 0 ORDER BY saled_price ASC";
                let result1 = await connection.query(query1, [main_category_id]);

                if (!result1[0]) {
                    res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.WRONG_PARAMS));
                } else {
                    delete result1.meta;
                    data.product = result1;
                }
                // 가격 높은 순
            } else if (flag == 4) {
                let query2 = "SELECT main_img,name,content,price,ROUND((1-(sale_ratio*0.01))*price,0) AS saled_price FROM products WHERE main_category_id=? AND is_package = 0 ORDER BY saled_price DESC";
                let result2 = await connection.query(query2, [main_category_id]);
                if (!result2[0]) {
                    res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.WRONG_PARAMS));
                } else {
                    delete result2.meta;
                    data.product = result2;
                }
            }
            let query3 = "SELECT COUNT(*) AS product_count FROM products WHERE main_category_id=?";

            let result3 = await connection.query(query3, [main_category_id]);
            if (!result3) {
                //res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.WRONG_PARAMS));
            } else {
                //console.log(result2);
                data.product_count = result3[0].product_count;
                //console.log(data);
            }
        }
    } catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    } finally {
        console.log(data);
        //res.status(200).json(utils.successTrue(statusCode.OK, resMessage.READ_SUCCESS, data));
        connection.release();
    }
})

module.exports = router;

