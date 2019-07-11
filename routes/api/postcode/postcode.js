var express = require('express');
var router = express.Router();

const responseMessage = require('../../../module/response/responseMessage');
const statusCode = require('../../../module/response/statusCode');
const utils = require('../../../module/response/utils');
const axios = require('axios');
const pool = require('../../../config/dbConfig');
const jwt = require('../../../module/jwt');

router.get('/', async (req, res) => { 
    try {
        res.render('postcode');
    } catch (err) {
        console.log(err);
    }
});

router.post('/', async (req, res) => {
    try {
        console.log('postcode POST 요청 데이터 : ', req.body);
        var { address_data } = req.body;
    } catch (err) {
        console.log(err);
    }
})

router.get('/mobile', async (req, res) => {
    try {
        console.log('address_data 찍히는 지 확인 : ', address_data);
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;

