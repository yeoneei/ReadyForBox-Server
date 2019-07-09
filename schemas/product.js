const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
    // 상품명
    name: {
        type: String, 
        required: true, 
    },
    // 상품에 대한 부가 설명
    content: {
        type: String
    },
    // 상품 대표 이미지
    main_img: {
        type: String,
        required: true
    },
    // 상품 설명 이미지
    content_img: {
        type: [String]
    },
    // 상품 가격 (할인 전)
    price: {
        type: Number,
        required: true
    },
    // 할인율 (0~100)
    sale_ratio: {
        type: Number,
        default: 0
    },
    saled_price: {
        type: Number,
        required: true
    },
    // 상품 등록 시간
    created_at: {
        type: Date,
        default: Date.now
    },
    // 상품 수정 시간
    updated_at: {
        type: Date
    },
    // 상품 삭제 시간
    deleted_at: {
        type: Date
    },
    // '정기 배송' 상품으로 사용자한테 보여줄 건지 여부
    is_regular_product: {
        type: Boolean,
        required: true
    },
    // '패키지' 상품으로 사용자한테 보여줄 건지 여부
    is_package_product: {
        type: Boolean,
        required: true
    },
    // 분류
    category: {
        type: [String]
    }
});

module.exports = mongoose.model('Product', productSchema)