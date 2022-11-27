import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/login.scss";
import axios from "axios";

import imgLogin from "../assets/images/icon/user.png";

const Login = () => {
  const [inputs, setInputs] = useState({
    userId: "",
    password: "",
  });

  const { userId, password } = inputs;

  const inputValue = (e) => {
    const value = e.target.value;
    const id = e.target.id;

    setInputs({
      ...inputs,
      [id]: value,
    });
  };

  //로그인
  const login = () => {
    let loginParams = {
      nickname: userId,
      password: password,
    };

    axios
      .post("http://localhost:8080/api/login", loginParams)
      .then((res) => console.log("test!" + res))
      .catch((err) => console.log(err));
  };

  return (
    <div className="login">
      <div className="login-wrap">
        <img src={imgLogin} alt="login" />
        <h1>로그인</h1>
        <div className="input-box">
          <input
            id="userId"
            type="text"
            name="userId"
            placeholder="아이디"
            value={userId}
            onChange={inputValue}
          />
          <label htmlFor="userId">아이디</label>
        </div>

        <div className="input-box">
          <input
            id="password"
            type="password"
            name="password"
            placeholder="비밀번호"
            value={password}
            onChange={inputValue}
          />
          <label htmlFor="password">비밀번호</label>
        </div>

        <button onClick={login}>로그인</button>

        <div className="findAccount">아이디/비밀번호 찾기</div>
        <div className="join">
          <Link to="/Join">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
