import React from "react";
import "../assets/login.scss";

const Login = () => {
  return (
    <div className='login'>
      <h1> 로그인</h1>
      <div className='login-wrap'>
        <div className='input-box'>
          <input id='username' type='text' name='username' placeholder='아이디' />
          <label for='username'>아이디</label>
        </div>

        <div className='input-box'>
          <input id='password' type='password' name='password' placeholder='비밀번호' />
          <label for='password'>비밀번호</label>
        </div>

        <button>로그인</button>
      </div>
    </div>
  );
};

export default Login;
