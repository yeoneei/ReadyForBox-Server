var express = require('express');
var router = express.Router();
const responseMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const utils = require('../../../module/response/utils');

// 몽고 DB Schema
const Package = require('../../../schemas/package');

// 패키지 상품 리스트 보여주기
router.get('/', async (req, res) => {
    try {
        const { category, flag } = req.query;
        if (!category || !flag) {
            res.status(200).json(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        } else {
            var test = await Package.find();
            console.log(test);
            // 최신순
            if (flag == 1) {
                var packages = await Package.find({
                    category: { $in: [category]},
                }).
                sort({ created_at: 'desc' })

            // 가격 낮은 순
            } else if (flag == 3) {
                var packages = await Package.find({
                    category: { $in: [category]},
                }).
                sort({ price: 'asc' })

            // 가격 높은 순
            } else if (flag == 4) {
                var packages = await Package.find({
                    category: { $in: [category]},
                }).
                sort({ price: 'desc' })
            }

            let package_data = [];
            for(let i = 0; i < packages.length; i++) {
                package_data[i] = {
                    package_id: packages[i]._id,
                    name: packages[i].name,
                    main_img: packages[i].main_img,
                    price: packages[i].price,
                    saled_price: Math.round(packages[i].price * (((100 - packages[i].sale_ratio) / 100))*0.01) * 100
                }
            }

            const data = {
                package_count: packages.length,
                package: package_data
            }
            
            res.status(200).json(utils.successTrue(statusCode.OK, responseMessage.READ_SUCCESS, data));
        }
    } catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    }
})

module.exports = router;