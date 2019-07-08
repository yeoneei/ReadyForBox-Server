var express = require('express');
var router = express.Router();

const responseMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const utils = require('../../../module/response/utils');
//const pool = require('../../../config/dbConfig');

// 몽고 DB Schema
const Product = require('../../../schemas/product');

router.get('/', async (req, res) => {
    try {
        const { product_id } = req.query;

        if (!product_id) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        } else {
            var products = await Product.find({
                _id: product_id,
                is_regular_product: true
            })

            let data = {
                main_img: products[0].main_img,
                name: products[0].name,
                content: products[0].content,
                sale_ratio: products[0].sale_ratio,
                price: products[0].price,
                saled_price: Math.round(products[0].price * (((100 - products[0].sale_ratio) / 100)), 0),
                content_img: products[0].content_img
            }
            res.status(200).json(utils.successTrue(statusCode.OK, responseMessage.READ_SUCCESS, data));
        }
        /*var connection = await pool.getConnection();
        const { product_id } = req.query;
        
        if (!product_id) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        } else {
            let query1 = "SELECT main_img, name, content, sale_ratio, price, "
                + "ROUND(price * (1 - (sale_ratio / 100)), 0) AS saled_price "
                + "FROM products WHERE product_id = ?";
            let result1 = await connection.query(query1, [product_id]);
            console.log(result1);
            
            let query2 = "SELECT img FROM product_content_imgs WHERE product_id = ?"
            let result2 = await connection.query(query2, [product_id]);
            console.log(result2);

            let data = result1[0];
            data.content_img = result2;
            res.status(200).json(utils.successTrue(statusCode.OK, responseMessage.READ_SUCCESS, data));
        }*/
    }
    catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
})

module.exports = router;