//환경변수 production에서 연결 시, prod.js내용을 가지고 온다.
if(process.env.NODE_ENV === "production"){
    module.exports = require('./prod')
}else{
    module.exports = require('./dev')
}