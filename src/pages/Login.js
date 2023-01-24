import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../assets/login.scss";
import Modal from "./component/modal";

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
    if (!userId) {
      openModal();
      changeModalMsg("아이디를 입력해주세요");
      return;
    }

    if (!password) {
      openModal();
      changeModalMsg("비밀번호를 입력해주세요");
      return;
    }

    let loginParams = {
      nickname: userId,
      password: password,
    };

    axios
      .post("http://localhost:8080/api/login", loginParams)
      .then((res) => {
        if (res.data.result === "err") {
          openModal();
          changeModalMsg("로그인에 실패했습니다");
        }
      })
      .catch((err) => console.log(err));
  };

  // 모달창 제어
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const changeModalMsg = (msg) => {
    setModalMsg(msg);
  };

  return (
    <div className="login">
      <Modal msg={modalMsg} open={modalOpen} close={closeModal} />
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
