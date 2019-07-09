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
            // 최신순
            if (flag == 1) {
                var package = await Package.find({
                    category: { $in: [category]},
                }).
                sort({ created_at: 'desc' })

            // 가격 낮은 순
            } else if (flag == 3) {
                var package = await Package.find({
                    category: { $in: [category]},
                }).
                sort({ price: 'asc' })

            // 가격 높은 순
            } else if (flag == 4) {
                var package = await Package.find({
                    category: { $in: [category]},
                }).
                sort({ price: 'desc' })
            }

            let package_data = [];
            for(let i = 0; i < package.length; i++) {
                package_data[i] = {
                    package_id: package[i]._id,
                    name: package[i].name,
                    main_img: package[i].main_img,
                    price: package[i].price,
                    saled_price: Math.round(package[i].price * (((100 - package[i].sale_ratio) / 100)), 0)
                }
            }

            const data = {
                package_count: package.length,
                packages: package_data
            }
            
            res.status(200).json(utils.successTrue(statusCode.OK, responseMessage.READ_SUCCESS, data));
        }
    } catch (err) {
        console.log(err);
        res.status(200).json(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    }
})

module.exports = router;