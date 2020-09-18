//포트 설정
const express = require('express')
const app = express()
const port = 5000

//MongDB를 mongoose를 통해서 사용한다.
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://yuni:oracle@yuni.0kxn5.mongodb.net/yuni?retryWrites=true&w=majority', {
    useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongDB Connected.')).catch(err => console.log(err))

//페이지 접속시 나오는 텍스트
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//해당 포트로 연다.
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})