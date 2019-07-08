const mongoose = require('mongoose');

const { Schema } = mongoose;

const packageSchema = new Schema({
    // 패키지명
    name: {
        type: String, 
        required: true,
    },
    // 패키지 대표 이미지
    main_img: {
        type: String,
        required: true
    },
    // 할인율
    sale_ratio: {
        type: Number,
        default: 0
    },
    // 패키지 상품을 등록한 시간
    created_at: {
        type: Date,
        default: Date.now
    },
    // 패키지 상품을 가장 최근에 수정한 시간
    updated_at: {
        type: Date
    },
    // 패키지 상품을 삭제한 시간
    deleted_at: {
        type: Date
    },
    // 분류
    category: {
        type: [String]
    },
    // 패키지 안에 포함되어 있는 상품들
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    }],
});

module.exports = mongoose.model('Package', packageSchema)