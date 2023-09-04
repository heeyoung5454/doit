import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "utile/http";
import "../../assets/login.scss";
import Modal from "../component/modal";

import imgLogin from "../../assets/images/icon/user.png";

const Login = () => {
  useEffect(() => {
    //토큰 존재하면 메인페이지 이동

    if (localStorage.getItem("token")) {
      changeMoveUrl("/main");
    }
  }, []);

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

    http
      .post("/login", loginParams)
      .then((res) => {
        if (res.data.result === "suc") {
          openModal();
          changeModalMsg("로그인에 성공했습니다.");
          changeMoveUrl("/main");
          // 로컬스토리지에 저장
          localStorage.setItem("token", res.data.data.accessToken);
        } else if (res.data.result === "err") {
          openModal();
          changeModalMsg("로그인에 실패했습니다");
        }
      })
      .catch((err) => console.log(err));
  };

  // 로그인 성공시 페이지 이동
  const movePage = useNavigate();

  // 모달창 제어
  const [modalOpen, setModalOpen] = useState(false); // 팝업 호출
  const [modalMsg, setModalMsg] = useState(""); // 팝업 메세지

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const changeMoveUrl = (pageUrl) => {
    movePage(pageUrl); // 페이지 이동
  };

  const changeModalMsg = (msg) => {
    setModalMsg(msg);
  };

  return (
    <div className='login'>
      <Modal msg={modalMsg} open={modalOpen} close={closeModal} />
      <div className='login-wrap'>
        <img src={imgLogin} alt='login' />
        <h1>Login</h1>
        <div className='input-box'>
          <input id='userId' type='text' name='userId' placeholder='아이디' value={userId} onChange={inputValue} />
          <label htmlFor='userId'>아이디</label>
        </div>

        <div className='input-box'>
          <input id='password' type='password' name='password' placeholder='비밀번호' value={password} onChange={inputValue} />
          <label htmlFor='password'>비밀번호</label>
        </div>

        <button onClick={login}>로그인</button>

        <div className='findAccount'>아이디/비밀번호 찾기</div>
        <div className='btn-join'>
          <Link to='/Join'>회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
