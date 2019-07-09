var express = require('express');
var router = express.Router();
var Product = require('../../schemas/product');
var Package = require('../../schemas/package');

router.use('/product',require('./product'));
router.use('/mypage', require('./mypage'));
router.use('/auth', require('./auth'));

//csv파일로 한 번에 실제 데이터 삽입
router.use('/insert_data', require('./insert_data'));

// 데이터 임의로 몇개만 삽입
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

        const package = new Package({
            name: 'test',
            main_img: 'akjasdbf',
            category: '홈카페',
            products: ['5d22f3f7617cef8618be7988', '5d230b3f63100c63a89cc92b'],
            price: 200000,
        })

        const result2 = await package.save();
        console.log('product 결과값 : ', result);
        console.log('package 결과값 : ', result2)

    } catch (err) {
        console.log(err);
    }
});





module.exports = router;
