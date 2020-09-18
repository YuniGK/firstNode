const mongoose = require('mongoose')

//DB 스키마 작성
const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true,//빈 문자 없애기
        unique : 1 //유니크 중복되지 않는다.
    },
    password : {
        type : String,
        minlength : 5
    },
    lastname : {
        type : String,
        maxlength : 50
    },
    //관리자 / 일반회원 구분
    role : {
        type : Number,
        default : 0 //기본값 
    },
    /* image : {type : String} */
    image : String,
    //유효성 관리
    token : String,
    //유효기간
    tokenExp : Number
})

//모델(데이터)과 스키마를 감싼다.
const User = mongoose.model('User', userSchema)

//다른곳에서 사용이 가능하도록 설정한다.
module.exports = {User}