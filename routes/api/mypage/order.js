var express = require('express');
var router = express.Router();
const utils = require('../../../module/response/utils');
const resMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const pool = require('../../../config/dbConfig');
const jwt = require('../../../module/jwt');

const Product = require('../../../schemas/product');
const Package = require('../../../schemas/package');

router.get('/', jwt.isLoggedIn, async (req, res) => {
    try {
        var connection = await pool.getConnection();
        const { user_id } = req.decoded;
        if (!user_id) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else {
            let data = new Object();
            var regularArr = new Array();
            var packageArr = new Array();

            let query = "SELECT order_id, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC";
            let result = await connection.query(query, [user_id]);
            for (var j = 0; j < result.length; j++) {
                let query2 = "SELECT delivery_day, delivery_cycle, is_subscribed FROM regular_deliveries WHERE order_id = ?"
                let result2 = await connection.query(query2, [result[j].order_id]);
                let query3 = "SELECT products.product_id, count FROM orders_products LEFT JOIN "
                    + "products ON orders_products.product_id = products.product_id "
                    + "WHERE order_id = ?"
                let result3 = await connection.query(query3, [result[j].order_id]);

                let query4 = "SELECT packages.package_id, count FROM orders_packages LEFT JOIN "
                    + "packages ON orders_packages.package_id = packages.package_id "
                    + "WHERE order_id = ?"
                let result4 = await connection.query(query4, [result[j].order_id]);

                if (result4[0] === undefined) {
                    console.log('empty')
                    continue;
                } else {
                    for (var i = 0; i < result4.length; i++) {
                        console.log(result4.length);
                        var package = await Package.find({
                            _id: result4[i].package_id
                        })
                        var packages = new Object();
                        packages.created_at = result[j].created_at;
                        packages.order_id = result[j].order_id;
                        packages.main_img = package[0].main_img;
                        packages.name = package[0].name;
                        packages.count = result4[i].count;
                        packages.saled_price = Math.round(package[0].price * (((100 - package[0].sale_ratio) / 100))*0.01) * 100
                        packageArr.push(packages);
                    }
                }
                if (result3[0] === undefined) {
                    console.log('empty')
                    continue;
                } else {
                    for (var i = 0; i < result3.length; i++) {
                        var products = await Product.find({
                            _id: result3[i].product_id
                        })
                        var regular = new Object();
                        regular.created_at = result[j].created_at;
                        regular.order_id = result[j].order_id;
                        regular.delivery_cycle = result2[0].delivery_cycle;
                        regular.delivery_day = result2[0].delivery_day;
                        regular.main_img = products[0].main_img;
                        regular.name = products[0].name;
                        regular.content = products[0].content;
                        regular.count = result3[i].count;
                        regular.saled_price = Math.round(products[0].price * (((100 - products[0].sale_ratio) / 100))*0.01) * 100
                        regular.is_subscribed = result2[0].is_subscribed;
                        regularArr.push(regular);
                    }
                }
            }
            data.regular = regularArr;
            data.package = packageArr;
            res.status(200).json(utils.successTrue(statusCode.OK, resMessage.READ_SUCCESS, data));
        }
    } catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    } finally {
        connection.release();
    }
})
module.exports = router;