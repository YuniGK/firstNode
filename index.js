//포트 설정

/* require - 모듈을 불러온다.
require('express') - express 인자로 받아온다. */
const express = require('express')
const app = express()
const port = 5000

//쿠키에 저장할 수 있도록 한다.
const cookieParser = require('cookie-parser')

//Body-parser 미들웨어 - 클라이언트의 정보를 가지고 온다.
const bodyParser = require('body-parser')

//Body-parser option ----------------
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : true}))
//application/json
app.use(bodyParser.json())
//Body-parser option ----------------

//cookie-parser option ----------------
app.use(cookieParser())
//cookie-parser option ----------------

const {Auth} = require("./middleware/auth")

//MongDB를 연결하기 위한 key값
const config = require("./config/key")

//DB 스키마 생성했던 부분 가져오기
const {User} = require("./models/User")

//MongDB를 mongoose를 통해서 사용한다.
const mongoose = require('mongoose')
const auth = require('./middleware/auth')
mongoose.connect(config.mongoURI, {
    useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongDB Connected.')).catch(err => console.log(err))

/* ---------------------------------- */

//페이지 접속시 나오는 텍스트
app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.post('/api/users/reqister', (req, res) => {
  /* 회원 가입 시, 필요한 정보를 데이터베이스에 넣어준다. */
  //인스턴스 생성
                      //요청 정보, body에 넣는다. json 형식 {name : "name"}
  const user = new User(req.body)

  //MongDB에 저장한다. 
  user.save((err, uesrInfo) => {
    //실패
    if (err) 
      return res.json({success : false, err})
    //성공 
    return res.status(200).json({
      success : true
    })
  })

})

app.post('/api/users/login', (req, res) => {

  //데이터 베이스에 이메일 있는지 확인
  User.findOne({email : req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess : false,
        message : "이메일에 해당하는 유저가 없습니다."
      })
    }

    //이메일이 있다면, 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch){
        return res.json({
          loginSuccess : false,
          message : "비밀번호가 틀렸습니다."
        })
      }

      //토큰 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err)

        /* 토큰을 저장한다, 저장장소는 쿠키, 로컬스토리지가 있다. - 쿠키에 저장했다. 
        x_auth이름으로 user.token의 내용을 저장한다. */
        res.cookie("x_auth", user.token).status(200).json({
          loginSuccess : true,
          userId : user._id 
        })
      })

    })

  })
})

app.get('/api/users/auth', auth, (req, res) => {
  
  //auth 미들웨어 통과, 인증처리는 참이다. 
  res.status(200).json({
    //auth에서 user를 넣었기에 사용이 가능하다.
    _id : req.user._id,
    isAdmin : req.user.role === 0 ? false : true,
    isAuth : true,
    email : req.user.email,
    name : req.user.name,
    lastname : req.user.lastname,
    role : req.user.role,
    image : req.user.image
  })

})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id:req.user._id},
    {token : ""}, 
    (err, user) => {
      if(err) return res.json({success : false, err})

      return res.status(200).send({success : true})  
    })
})

/* ---------------------------------- */

//해당 포트로 연다.
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})