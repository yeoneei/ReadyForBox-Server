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
    }
    catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
})

module.exports = router;