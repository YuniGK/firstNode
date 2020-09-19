const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/* bcrypt를 통한 암호화를 위해서는 salt생성 후, 암호화한다.
saltRounds = 몇글자인지 나타낸다.*/
const saltRounds = 10;

//DB 스키마 작성 -----------------------------------------
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
// end DB 스키마 작성 -----------------------------------------

//데이터를 저장하기 전에 먼저 수행된다.
userSchema.pre('save', function(next){
    var user = this;

    //비밀번호를 변경할때에만 아래의 작업을 수행한다.
    if(user.isModified('password')){
        /* 비밀번호를 암호화시킨다. 

        next - 파라미터를 이용해 save에 전달해준다.

        genSalt - salt 생성
        function(err, salt) - 오류가 났을 경우 err / 성공했을 경우 salt */
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) 
                return next(err)

            /* user.password - 클라이언트에서 입력된 비밀번호 
            function(err, hash) - hash 성공시 암호화된 비밀번호 */
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash

                next()
            });
        });
    }else{
        next()
    }    
})

//comparePassword 메소드
                                                //callback
userSchema.methods.comparePassword = function(plainPwd, cb){
    bcrypt.compare(plainPwd, this.password, function(err, isMatch){
        if(err){
                /* 비밀번호가 일치하지 않을 경우 callback
                   비밀번호가 일치하면, err = null, isMatch = true */
            return cb(err), cb(null, isMatch)
        }
    })
}

//토큰생성
userSchema.methods.generateToken = function(cb) {
    var user = this;

    //jsonwebtoken을 이용한 Token 생성 user._id+token형식으로 변경된다.
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    //데이터베이스에 넣어준다.
    user.token = token

    user.save(function(err, user){
        if(err) return(err)
        cb(null, user)
    })

}

//토큰유무
userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    /* 토큰을 복구화
    기존의 user._id+token에서 -token한 값으로 user._id만 남아서 decoded에 들어간다. */
    jwt.verify(token, 'secretToken', function (err, decoded) {

        //유저 아이디를 이용해 유저를 찾은 후, 클라이언트에서 가져온 토큰과 데이터베이스의 토큰을 비교한다.
        user.findOne({"_id":decoded, "token" : token}, function(err, user){
            if(err) return cb(err)
            cb(null, user)
        })
    })
}

//모델(데이터)과 스키마를 감싼다.
const User = mongoose.model('User', userSchema)

//다른곳에서 사용이 가능하도록 설정한다. 모듈화 시켜, 외부에서 사용이 가능하도록 한다.
module.exports = {User}