var express = require('express');
var router = express.Router();

const responseMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const utils = require('../../../module/response/utils');
//const pool = require('../../../config/dbConfig');

// 몽고 DB Schema
const Package = require('../../../schemas/package');

router.get('/', async (req, res) => {
    try {
        const { package_id } = req.query;

        if (!package_id) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        } else {
            var package = await Package.find({
                _id: package_id,
            }).populate('products')
            console.log(package[0].products.length);
            var productArr = new Array();
            for (var i = 0; i < package[0].products.length; i++) {
                var product = new Object();
                product.product_id = package[0].products[i]._id;
                product.main_img = package[0].products[i].main_img;
                product.name = package[0].products[i].name;
                product.price = package[0].products[i].price;
                productArr.push(product);
            }
            let data = {
                package_id: package[0]._id,
                main_img: package[0].main_img,
                name: package[0].name,
                sale_ratio: package[0].sale_ratio,
                price: package[0].price,
                saled_price: Math.round(package[0].price * (((100 - package[0].sale_ratio) / 100)), 0),
                product: productArr
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
