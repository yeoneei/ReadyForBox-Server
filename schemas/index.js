const mongoose = require('mongoose');

module.exports = async () => {
    try {
        const connect = async () => {
            try {
                if (process.env.NODE_ENV !== 'production') {
                    mongoose.set('debug', true)
                }
                await mongoose.connect(process.env.MONGODB_CONNECT_URL, 
                {
                    useNewUrlParser: true,
                    user: process.env.MONGODB_USERID,
                    pass: process.env.MONGODB_PASSWORD,
                    dbName: process.env.MONGODB_DBNAME
                })
                console.log('몽고디비 연결 성공');
            } catch (err) {  
                console.log('몽고디비 연결 에러', err);
            }
        }
        connect();
        // mongoose.connection.on('error', (error) => {
        //     console.log('몽고디비 연결 에러', error);
        // });
        // mongoose.connection.on('disconnected', () => {
        //     console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
        //     connect();
        // });

        require('./product');
        require('./package');
    } catch (err) {
        console.log(err);
    }
}