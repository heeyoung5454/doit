import React, { useState } from "react";
import "../../assets/searchPop.scss";
import http from "utile/http";
import { useNavigate } from "react-router-dom";

const SearchPop = (props) => {
  const [inputs, setInputs] = useState({
    keyword: "",
  });

  const [memberList, setMemberList] = useState([]);

  const { keyword } = inputs;

  const inputValue = (e) => {
    const value = e.target.value;
    const id = e.target.id;

    // 리액트에서 상태변화시 참조주소값을 찾아야기때문에 깊은 복사 활용
    setInputs({
      ...inputs,
      [id]: value,
    });
  };

  const search = () => {
    http
      .get("/members?condition=" + keyword)
      .then((res) => {
        if (res.data.result === "suc") {
          setMemberList(res.data.data.searchMemberList);
        } else if (res.data.result === "err") {
          alert("실패하셨습니다.");
          return;
        }
      })
      .catch((err) => console.log("catch :: " + err));
  };

  const getState = (state) => {
    if (state === "FOLLOW") {
      return "state-follow";
    } else if (state === "BLOCK") {
      return "state-block";
    }
  };

  const GetMemberList = () => {
    const searchMemberList = [];

    for (let i = 0; i < memberList.length; i++) {
      searchMemberList.push(
        <div className='member' key={i}>
          <span className={getState(memberList[i].state)}>{memberList[i].nickname} </span>
          <button className='go' onClick={() => moveHome(memberList[i].memberId, memberList[i].nickname)}>
            바로가기
          </button>
        </div>
      );
    }

    return <div className='member-list'>{searchMemberList} </div>;
  };

  // 페이지 이동
  const pageMove = useNavigate();

  const moveHome = (memberId, nickname) => {
    pageMove("/home/" + memberId, {
      state: {
        memberId: memberId,
        nickname: nickname,
      },
    });
  };

  if (props.open) {
    return (
      <div className={"modal-bg"}>
        <div className={"modal-wrap"}>
          <div className={"friend-modal"}>
            <h1>친구찾기</h1>
            <div className={"modal-content"}>
              <div className={"keyword-input"}>
                <input id='keyword' type='text' name='keyword' placeholder='검색어' value={keyword} onChange={inputValue} />
                <button onClick={() => search()}> 검색</button>
              </div>
              <GetMemberList />
            </div>
            <button className={"btn-confirm"} onClick={props.close}>
              확인
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default SearchPop;
