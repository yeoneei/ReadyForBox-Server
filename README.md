# 준비해박스 (19.06.30.~19.07.13.)
![서비스 워크플로우](./public/images/service_workflow.jpg)


## Description
* SOPT 24기 앱잼(app-jam)

* 프로젝트 설명 : 자취생을 위한 정기배송 서비스
  * 2030 1인 가구를 위한 생필품 정기배송과 자신만의 자취방을 꾸미고 싶은 이들을 위한 패키지 서비스를 제공하는 큐레이션 기반 E-커머스

* 프로젝트 기간 : 2019년 06월 30일 ~ 2019년 07월 12일

* 어플리케이션 구성 : Mobile App(Android, iOS), Server

* **API** : http://13.209.206.99:3000/docs/#/

## 사용한 도구
- Github
- DB (MariaDB, WorkBench / MongoDB, Mongoose, Compass / AWS RDS)
- Node.js (+ Express.js)
- AWS (EC2, RDS, S3, IAM)


## 구현한 핵심 기능
### 정기 결제 기능
- 아임포트(Iamport)를 이용한 정기 결제 기능 구현

### 회원가입 및 로그인 
- JWT 이용

### 기타 기능
- 상품 리스트 조회 및 세부 사항 조회
- 마이페이지


## 의존성

```json

  "dependencies": {
    "aws-sdk": "^2.485.0",
    "axios": "^0.19.0",
    "cookie-parser": "~1.4.3",
    "crypto-promise": "^2.1.0",
    "debug": "~2.6.9",
    "dotenv": "^8.0.0",
    "ejs": "^2.6.2",
    "express": "~4.16.0",
    "http-errors": "~1.6.2",
    "jade": "~1.11.0",
    "jsonwebtoken": "^8.5.1",
    "mariadb": "^2.0.5",
    "mongoose": "^5.6.3",
    "morgan": "~1.9.0",
    "multer": "^1.4.1",
    "multer-s3": "^2.9.0",
    "mysql": "^2.17.1",
    "urlencode": "^1.1.0"
  }

```



## 사용된 도구

* [Node.js](https://nodejs.org/ko/) - Chrome V8 자바스크립트 엔진으로 빌드된 자바스크립트 런타임

* [Express.js](http://expressjs.com/ko/) - Node.js 웹 애플리케이션 프레임워크

* [NPM](https://rometools.github.io/rome/) - 자바 스크립트 패키지 관리자

* [vscode](https://code.visualstudio.com/) - 편집기

* [MongoDB](https://www.mongodb.com/) - DataBase

* [MariaDB](https://www.mariadb.com/) - DataBase


## 개발자

*  **박재성** ([jaeseongDev](https://github.com/jaeseongDev))
*  **고성진** ([seongjin96](https://github.com/seongjin96))
*  **조연희** ([yeoneei](https://github.com/yeoneei))
