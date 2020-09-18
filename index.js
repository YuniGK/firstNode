//포트 설정
const express = require('express')
const app = express()
const port = 5000

//Body-parser 미들웨어 - 클라이언트의 정보를 가지고 온다.
const bodyParser = require('body-parser')

//Body-parser option
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : true}))
//application/json
app.use(bodyParser.json())

//MongDB를 연결하기 위한 key값
const config = require("./config/key")

//DB 스키마 생성했던 부분 가져오기
const {User} = require("./models/User")

//MongDB를 mongoose를 통해서 사용한다.
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongDB Connected.')).catch(err => console.log(err))

/* ---------------------------------- */

//페이지 접속시 나오는 텍스트
app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.post('/reqister', (req, res) => {
  /* 회원 가입 시, 필요한 정보를 데이터베이스에 넣어준다. */
  //인스턴스 생성
                      //요청 정보, body에 넣는다. json 형식 {name : "name"}
  const user = new User(req.body)

  //MongDB에 저장한다. 
  user.save((err, uesrInfo) => {
    //실패
    if (err) return res.json({success : false, err})
    //성공 
    return res.status(200).json({
      success : true
    })
  })

})

/* ---------------------------------- */

//해당 포트로 연다.
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})