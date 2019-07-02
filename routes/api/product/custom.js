var express = require('express');
var router = express.Router();

const responseMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const utils = require('../../../module/response/utils');
const pool = require('../../../config/dbConfig');

router.get('/', async (req, res) => {
    try {
        var connection = await pool.getConnection();

        const { first, second, fifth, minprice, maxprice } = req.query;

        if (!first || !second || !fifth || !minprice || !maxprice) {
            console.log("Error");
            // res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.WRONG_PARAMS));
        } else {
            // 파라미터와 카테고리 이름으로 카테고리id를 얻는 과정
            console.log("Confirm");
            let query1 = "SELECT custom_category_id FROM custom_categories WHERE name = ?";
            let result1 = await connection.query(query1, [first]);
            console.log(result1[0].custom_category_id);
            let query2 = "SELECT custom_category_id FROM custom_categories WHERE name = ?"
            let result2 = await connection.query(query2, [second]);
            console.log(result2[0].custom_category_id);
            let query3 = "SELECT custom_category_id FROM custom_categories WHERE name = ?"
            let result3 = await connection.query(query3, [fifth]);
            console.log(result3[0].custom_category_id);


            // 패키지 상품 1,2등 관련 랜덤 3개 대표이미지
            let getPackageQuery = `SELECT main_img FROM products WHERE (custom_category_id=${result1[0].custom_category_id} OR custom_category_id=${result2[0].custom_category_id}) AND is_package=1 AND (1-(sale_ratio*0.01))*price >= ${minprice} AND (1-(sale_ratio*0.01))*price <= ${maxprice}`;
            let getPackageResult = await connection.query(getPackageQuery);
            delete getPackageResult.meta;

            getPackageResult.sort(function () {
                return Math.random() - Math.random();
            });

            let package = getPackageResult.slice(0, 3);
           // console.log(package);

            // 정기상품 1,2등관련 랜덤 5개 대표이미지
            let getRegularQuery = `SELECT main_img FROM products WHERE (custom_category_id=${result1[0].custom_category_id} OR custom_category_id=${result2[0].custom_category_id}) AND is_package=0 AND (1-(sale_ratio*0.01))*price >= ${minprice} AND (1-(sale_ratio*0.01))*price <= ${maxprice}`;
            let getRegularResult = await connection.query(getRegularQuery);
            delete getRegularResult.meta;

            getRegularResult.sort(function () {
                return Math.random() - Math.random();
            });

            let regularity = getRegularResult.slice(0, 5);
            //console.log(regularity);

            // 패키지상품 5등관련 랜덤 3개 대표이미지
            let getNotImportantQuery = `SELECT main_img FROM products WHERE custom_category_id=${result3[0].custom_category_id} AND is_package=1 AND (1-(sale_ratio*0.01))*price >= ${minprice} AND (1-(sale_ratio*0.01))*price <= ${maxprice}`;
            let getNotImportantResult = await connection.query(getNotImportantQuery);
            delete getNotImportantResult.meta;

            getNotImportantResult.sort(function () {
                return Math.random() - Math.random();
            });

            let notImportant = getNotImportantResult.slice(0, 3);
           // console.log(notImportant);

            let data = {
                package: package,
                regularity: regularity,
                notImportant: notImportant
            }
            console.log(data);
            //res.status(200).json(utils.successTrue(statusCode.OK, resMessage.READ_SUCCESS, data));
        }
    }
    catch {
        //res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
})
module.exports = router;