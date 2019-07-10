var express = require('express');
var router = express.Router();
const responseMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const utils = require('../../../module/response/utils');

// 몽고 DB Schema
const Product = require('../../../schemas/product');

// 정기 배송 상품 리스트 보여주기
router.get('/', async (req, res) => {
    try {
        const { category, flag, search } = req.query;

        if (!flag) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        } else {
            var option = new Object();

            if (typeof search === 'undefined' && typeof category !== 'undefined') {
                console.log("category")
                option = {
                    category: { $in: [category] },
                    is_regular_product: true
                }
            } else if (typeof search !== 'undefined' && typeof category === 'undefined') {
                console.log("search")
                option = {
                    $or: [{ name: { $regex: search } }, { content: { $regex: search } }],
                    is_regular_product: true
                }
            } else {
                res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
            }
            // 최신순
            if (flag == 1) {
                var products = await Product.find(option).
                    sort({ created_at: 'desc' })
                console.log(products);

                // 가격 낮은 순
            } else if (flag == 3) {
                var products = await Product.find(option).
                    sort({ price: 'asc' })

                // 가격 높은 순
            } else if (flag == 4) {
                var products = await Product.find(option).
                    sort({ price: 'desc' })
            }

            let product_data = [];
            for (let i = 0; i < products.length; i++) {
                product_data[i] = {
                    product_id: products[i]._id,
                    name: products[i].name,
                    content: products[i].content,
                    main_img: products[i].main_img,
                    price: products[i].price,
                    saled_price: Math.round((products[i].price * ((100 - products[i].sale_ratio) / 100)) * 0.01) * 100
                }
            }

            const data = {
                product_count: products.length,
                product: product_data
            }

            res.status(200).json(utils.successTrue(statusCode.OK, responseMessage.READ_SUCCESS, data));
        }
    } catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
})

module.exports = router;