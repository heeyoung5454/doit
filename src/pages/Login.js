import React, { useState } from "react";
import "../assets/login.scss";
import axios from "axios";

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
      .post("http://loacalhost:8080/api/login", loginParams)
      .then((res) => console.log("test!" + res))
      .catch((err) => console.log(err));
  };

  return (
    <div className="login">
      <h1> 로그인</h1>
      <div className="login-wrap">
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
      </div>
    </div>
  );
};

export default Login;
