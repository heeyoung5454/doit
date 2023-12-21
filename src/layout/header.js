import React, { useState, useEffect } from "react";
import "../assets/header.scss";
import { http, logOutHttp } from "utile/http";
import { useNavigate } from "react-router-dom";
import Alarm from "../pages/component/alarm";

const Header = () => {
  // 로그인 성공시 페이지 이동
  const movePage = useNavigate();

  const afterLogout = () => {
    localStorage.removeItem("accessToken");

    movePage("/");
  };

  const logOut = () => {
    logOutHttp
      .post("/logout")
      .then((res) => {
        if (res.data.result === "suc") {
          alert("로그아웃 되었습니다.");

          afterLogout("/");
        } else if (res.data.result === "err") {
          alert("로그아웃에 실패하였습니다");
          return;
        }
      })
      .catch((err) => {
        alert("catch:: " + JSON.stringify(err));
      });
  };

  //*****알림 메세지 수싲********//
  const [modalOpen, setModalOpen] = useState(false); // 알림팝업 호출
  const [alarmList, setAlarmList] = useState([]); // 알림 메세지 리스트

  useEffect(() => {
    http
      .get("/alarm")
      .then((res) => {
        if (res.data.result === "suc") {
          setAlarmList(res.data.data.friendAlarmList);
        } else if (res.data.result === "err") {
          alert("알림 수신 실패했습니다.");
        }
      })
      .catch((err) => {
        alert("catch:: " + JSON.stringify(err));
      });
  }, []);

  const openModal = (e) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setModalOpen(false);
  };

  return (
    <div className='header-bar' onClick={(e) => closeModal(e)}>
      <div className='title'>
        <h2 onClick={() => movePage("/main")}>scheduler</h2>
      </div>
      <Alarm open={modalOpen} close={closeModal} pushList={alarmList} />

      <div className='alarm-icon' onClick={(e) => openModal(e)}>
        {alarmList.length > 0 ? "(" + alarmList.length + ")" : ""}
      </div>

      <div className='logout' onClick={() => logOut()}>
        로그아웃
      </div>
    </div>
  );
};

export default Header;
