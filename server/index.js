/* require - 모듈을 불러온다.
require('express') - express 인자로 받아온다. */
const express = require('express')
const app = express()

//Body-parser 미들웨어 - 클라이언트의 정보를 가지고 온다.
const bodyParser = require('body-parser');

//쿠키에 저장할 수 있도록 한다.
const cookieParser = require('cookie-parser');

//MongDB를 연결하기 위한 key값
const config = require('./config/key');

const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

//application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));

//application/json 
app.use(bodyParser.json());
app.use(cookieParser());

//MongDB를 mongoose를 통해서 사용한다.
const mongoose = require('mongoose')
//DB 스키마 생성했던 부분 가져오기
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

//페이지 접속시 나오는 텍스트
app.get('/', (req, res) => res.send('Hello World!~~ '))

app.get('/api/hello', (req, res) => res.send('Hello World!~~ '))

app.post('/api/users/register', (req, res) => {

  /* 회원 가입 시, 필요한 정보를 데이터베이스에 넣어준다. */
  //인스턴스 생성
                      //요청 정보, body에 넣는다. json 형식 {name : "name"}
  const user = new User(req.body)

  //MongDB에 저장한다. 
  user.save((err, userInfo) => {
    //실패
    if (err) return res.json({ success: false, err })
    //성공 
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {

  // console.log('ping')
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {

    // console.log('user', user)
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      // console.log('err',err)

      // console.log('isMatch',isMatch)

      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

      //비밀번호 까지 맞다면 토큰을 생성하기.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

         /* 토큰을 저장한다, 저장장소는 쿠키, 로컬스토리지가 있다. - 쿠키에 저장했다. 
        x_auth이름으로 user.token의 내용을 저장한다. */
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})


// role 1 어드민    role 2 특정 부서 어드민 
// role 0 -> 일반유저   role 0이 아니면  관리자 
app.get('/api/users/auth', auth, (req, res) => {
  //여기 까지 미들웨어를 통과해 왔다는 얘기는  Authentication 이 True 라는 말.
  res.status(200).json({
    //auth에서 user를 넣었기에 사용이 가능하다.
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  // console.log('req.user', req.user)
  User.findOneAndUpdate({ _id: req.user._id },
    { token: "" }
    , (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})

const port = 5000

//해당 포트로 연다.
app.listen(port, () => console.log(`Example app listening on port ${port}!`))