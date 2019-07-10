// var express = require('express');
// var router = express.Router();

// const responseMessage = require('../../../module/response/responseMessage');
// const statusCode = require('../../../module/response/statusCode');
// const utils = require('../../../module/response/utils');
// const pool = require('../../../config/dbConfig');

// router.get('/', async (req, res) => {
//     try {
//         var connection = await pool.getConnection();

//         const { first, second, fifth, minprice, maxprice } = req.query;

//         if (!first || !second || !fifth || !minprice || !maxprice) {
//             res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
//         } else {
//             // 파라미터와 카테고리 이름으로 카테고리id를 얻는 과정
//             // console.log("Confirm");
//             let query1 = "SELECT custom_category_id FROM custom_categories WHERE name = ?";
//             let result1 = await connection.query(query1, [first]);
//             // console.log(result1[0].custom_category_id);
//             let query2 = "SELECT custom_category_id FROM custom_categories WHERE name = ?"
//             let result2 = await connection.query(query2, [second]);
//             // console.log(result2[0].custom_category_id);
//             let query3 = "SELECT custom_category_id FROM custom_categories WHERE name = ?"
//             let result3 = await connection.query(query3, [fifth]);
//             // console.log(result3[0].custom_category_id);

//             if (!result1[0] || !result2[0] || !result3[0]) {
//                 res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.WRONG_PARAMS));
//             } else {
//                 // 패키지 상품 1,2등 관련 랜덤 3개 대표이미지
//                 let getPackageQuery = `SELECT product_id, main_img FROM products `
//                     + `WHERE (custom_category_id=${result1[0].custom_category_id} `
//                     + `OR custom_category_id=${result2[0].custom_category_id}) `
//                     + `AND is_package=1 AND (1-(sale_ratio*0.01))*price >= ${minprice} `
//                     + `AND (1-(sale_ratio*0.01))*price <= ${maxprice}`;
//                 let getPackageResult = await connection.query(getPackageQuery);

//                 getPackageResult.sort(function () {
//                     return Math.random() - Math.random();
//                 });
    
//                 let package = getPackageResult.slice(0, 3);
//                // console.log(package);
    
//                 // 정기상품 1,2등관련 랜덤 5개 대표이미지
//                 let getRegularQuery = `SELECT product_id, main_img FROM products `
//                     + `WHERE (custom_category_id=${result1[0].custom_category_id} `
//                     + `OR custom_category_id=${result2[0].custom_category_id}) `
//                     + `AND is_package=0 AND (1-(sale_ratio*0.01))*price >= ${minprice} `
//                     + `AND (1-(sale_ratio*0.01))*price <= ${maxprice}`;
//                 let getRegularResult = await connection.query(getRegularQuery);
    
//                 getRegularResult.sort(function () {
//                     return Math.random() - Math.random();
//                 });
    
//                 let regularity = getRegularResult.slice(0, 5);
//                 //console.log(regularity);
    
//                 // 패키지상품 5등관련 랜덤 3개 대표이미지
//                 let getNotImportantQuery = `SELECT product_id, main_img FROM products `
//                     + `WHERE custom_category_id=${result3[0].custom_category_id} `
//                     + `AND is_package=1 AND (1-(sale_ratio*0.01))*price >= ${minprice} `
//                     + `AND (1-(sale_ratio*0.01))*price <= ${maxprice}`;
//                 let getNotImportantResult = await connection.query(getNotImportantQuery);
    
//                 getNotImportantResult.sort(function () {
//                     return Math.random() - Math.random();
//                 });
    
//                 let notImportant = getNotImportantResult.slice(0, 3);
//                // console.log(notImportant);
    
//                 let data = {
//                     package: package,
//                     regularity: regularity,
//                     notImportant: notImportant
//                 }
//                 // console.log(data);
//                 res.status(200).json(utils.successTrue(statusCode.OK, responseMessage.READ_SUCCESS, data));
//             }
//         }
//     }
//     catch (err) {
//         console.log(err);
//         res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
//     } finally {
//         connection.release();
//     }
// })
// module.exports = router;

var express = require('express');
var router = express.Router();

const responseMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const utils = require('../../../module/response/utils');

// 몽고 DB Schema
const Product = require('../../../schemas/product');
const Package = require('../../../schemas/package');

router.get('/', async (req, res) => {
    try {
        const { first, second, fifth, minprice, maxprice } = req.query;

        if (!first || !second || !fifth || !minprice || !maxprice) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        } else {
            var package = await Package.find({
                $or: [{ category: first }, { category: second }],
                saled_price: { $gte: parseInt(minprice), $lte: parseInt(maxprice) },
            })

            var regularity = await Product.find({
                $or: [{ category: first }, { category: second }],
                saled_price: { $gte: parseInt(minprice), $lte: parseInt(maxprice) },
                is_regular_product: true,
            })

            var not_regularity = await Product.find({
                category: { $in: [fifth] },
                saled_price: { $gte: parseInt(minprice), $lte: parseInt(maxprice) },
                is_regular_product: true,
            })

            package.sort(function () {
                return Math.random() - Math.random();
            });

            regularity.sort(function () {
                return Math.random() - Math.random();
            });

            not_regularity.sort(function () {
                return Math.random() - Math.random();
            });

            if (package.length > 3) { package.length = 3; }
            if (regularity.length > 5) { regularity.length = 5; }
            if (not_regularity.length > 5) { not_regularity.length = 5; }

            let package_data = [];
            let regular_data = [];
            let notImportant_data = [];

            for (var i = 0; i < package.length; i++) {
                package_data[i] = {
                    package_id: package[i]._id,
                    main_img: package[i].main_img,
                    name: package[i].name,
                    saled_price: package[i].saled_price
                }
            }
            for (var i = 0; i < regularity.length; i++) {
                regular_data[i] = {
                    product_id: regularity[i]._id,
                    main_img: regularity[i].main_img,
                    name: regularity[i].name,
                    saled_price: regularity[i].saled_price
                }
            }
            for (var i = 0; i < not_regularity.length; i++) {
                notImportant_data[i] = {
                    product_id: not_regularity[i]._id,
                    main_img: not_regularity[i].main_img,
                    name: not_regularity[i].name,
                    saled_price: not_regularity[i].saled_price
                }
            }

            let data = {
                packages: package_data,
                regularity: regular_data,
                regular_not_Important: notImportant_data
            }
            res.status(200).json(utils.successTrue(statusCode.OK, responseMessage.READ_SUCCESS, data));
        }
    }
    catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
})

module.exports = router;