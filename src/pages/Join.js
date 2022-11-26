import React, { useState } from "react";
import axios from "axios";
import "../assets/join.scss";

const Join = () => {
  const [inputs, setInputs] = useState({
    nickname: "",
    password: "",
    introduction: "",
  });

  const { nickname, introduction, password } = inputs;

  const inputValue = (e) => {
    const value = e.target.value;
    const id = e.target.id;

    // 리액트에서 상태변화시 참조주소값을 찾아야기때문에 깊은 복사 활용
    setInputs({
      ...inputs,
      [id]: value,
    });
  };

  //회원가입
  const join = () => {
    let joinParams = {
      nickname: nickname,
      password: password,
      introduction: introduction,
    };

    axios.defaults.withCredentials = true;
    axios
      .post("http://loacalhost:8080/api/members/add", joinParams)
      .then((res) => console.log("test!" + res))
      .catch((err) => console.log(err));
  };

  return (
    <div className="join">
      <h1> 회원가입</h1>
      <div className="join-wrap">
        <div className="input-box">
          <label htmlFor="nickname">ID</label>
          <input
            id="nickname"
            type="text"
            name="nickname"
            placeholder="아이디"
            value={nickname}
            onChange={inputValue}
          />
        </div>

        <div className="input-box">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="비밀번호"
            value={password}
            onChange={inputValue}
          />
        </div>

        <div className="input-box">
          <label htmlFor="introduction">소개</label>
          <input
            id="introduction"
            type="text"
            name="introduction"
            placeholder="소개"
            value={introduction}
            onChange={inputValue}
          />
        </div>

        <button onClick={join}>회원가입</button>
      </div>
    </div>
  );
};

export default Join;
