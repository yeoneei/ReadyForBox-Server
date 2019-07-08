var express = require('express');
var router = express.Router();
var Product = require('../../schemas/product');

router.use('/product',require('./product'));
router.use('/mypage', require('./mypage'));
router.use('/auth', require('./auth'));

router.post('/', async (req, res) => {
    try {
        const { name, main_img, price, is_regular_product, is_package_product, category, sale_ratio, content } = req.body;
        const product = new Product({
            name,
            main_img,
            price,
            is_regular_product,
            is_package_product,
            category,
            sale_ratio,
            content
        })

        const result = await product.save()
        console.log('결과값 : ', result);
    } catch (err) {
        console.log(err);
    }
    

})

module.exports = router;
