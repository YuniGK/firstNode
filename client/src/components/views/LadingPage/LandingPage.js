import React, { useEffect } from 'react'
import axios from 'axios';
import { withRouter } from 'react-router-dom'; 

function LandingPage() {
    {/* 페이지에 접속시, useEffect를 실행한다. 
    /api/hello 서버에 접속 서버에서 받은 내용을 console에 출력한다. */}
    useEffect(() => {
        axios.get('/api/hello')
            .then(res => console.log(res.data))
    }, [])

    return(
        <div>
            LandingPage
        </div>
    )
}

export default LandingPage
