import React from "react";
import "../assets/header.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header = () => {
  // 로그인 성공시 페이지 이동
  const movePage = useNavigate();

  const afterLogout = () => {
    movePage("/");
  };

  const logOut = () => {
    axios
      .post("/api/logout")
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

  return (
    <div className="header-bar">
      <div className="title">
        <h2>scheduler</h2>
      </div>
      <div className="logout" onClick={() => logOut()}>
        로그아웃
      </div>
    </div>
  );
};

export default Header;
