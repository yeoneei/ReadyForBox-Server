var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const upload = require('../../config/multer');

router.get('/', async(req, res) => {
    // try {
    //     console.log('db 테스트');
    //     var connection = await pool.getConnection();
    //     let query = 'SELECT name, password FROM users'
    //     let result = await connection.query(query);
    //     console.log(result[0]);
    //     connection.end();
    //     console.log('연결 성공!!!!');
    // } catch (err) {
    //     console.log(err);
    //     connection.end();
    //     console.log('연결 실패ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ')
    // }
});

router.post('/', upload.single('avatar'), (req, res) => {
    // console.log('이미지 업로드 테스트!');
    // console.log(req.file);
})


module.exports = router;