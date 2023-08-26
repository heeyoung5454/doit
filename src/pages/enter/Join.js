import React, { useState } from "react";
import axios from "axios";
import "../../assets/join.scss";
import Modal from "../component/modal";
import { useNavigate } from "react-router-dom";

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
    if (!nickname) {
      openModal();
      changeModalMsg("아이디를 입력해주세요");
      return;
    }

    if (!password) {
      openModal();
      changeModalMsg("비밀번호를 입력해주세요");
      return;
    }

    let joinParams = {
      nickname: nickname,
      password: password,
      introduction: introduction,
    };

    axios.defaults.withCredentials = true;

    axios
      .post("/members/add", joinParams)
      .then((res) => {
        if (res.data.result === "suc") {
          openModal();
          setCloseType(true);
          changeModalMsg("회원가입에 성공했습니다.");
        } else if (res.data.result === "err") {
          openModal();
          changeModalMsg("회원가입에 실패하였습니다");
        }
      })
      .catch((err) => console.log(err));
  };

  // 모달창 제어
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [closeType, setCloseType] = useState(false); // 기본 false

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    if (closeType) {
      movePage("/");
    }
    setModalOpen(false); // 모달창 닫기
  };

  const changeModalMsg = (msg, type) => {
    setModalMsg(msg);
  };

  // 로그인 성공시 페이지 이동
  const movePage = useNavigate();

  return (
    <div className='join'>
      <Modal msg={modalMsg} open={modalOpen} close={closeModal} />
      <h1> 회원가입</h1>
      <div className='join-wrap'>
        <div className='input-box'>
          <label htmlFor='nickname'>ID</label>
          <input id='nickname' type='text' name='nickname' placeholder='아이디' value={nickname} onChange={inputValue} />
        </div>

        <div className='input-box'>
          <label htmlFor='password'>비밀번호</label>
          <input id='password' type='password' name='password' placeholder='비밀번호' value={password} onChange={inputValue} />
        </div>

        <div className='input-box'>
          <label htmlFor='introduction'>소개</label>
          <input id='introduction' type='text' name='introduction' placeholder='소개' value={introduction} onChange={inputValue} />
        </div>

        <button onClick={join}>회원가입</button>
      </div>
    </div>
  );
};

export default Join;
