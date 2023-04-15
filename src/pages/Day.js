import React from "react";
import "../assets/main.scss";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../assets/day.scss";

const Main = () => {
  const location = useLocation();

  // 이전페이지에서 가져온 시작일과 종료일 기준으로 사이값을 구한다(화면 그리기 위해)
  let choiceDate = location.state.choiceDate;

  //시작일, 종료일을 기점으로 화면 그리기
  let startDt = new Date(choiceDate[0]);
  let endDt = new Date(choiceDate[1]);
  let dayGroup = [];

  while (startDt <= endDt) {
    let start = startDt;

    let month = start.getMonth() + 1;
    let date = start.getDate();

    if (month < 10) {
      month = "0" + month;
    }

    if (date < 10) {
      date = "0" + date;
    }

    startDt.setDate(startDt.getDate() + 1);

    let fullDate =
      start.getFullYear() + "-" + month.toString() + "-" + date.toString();

    dayGroup.push(fullDate);
  }

  // 일정등록
  const planInsert = () => {
    let insertParams = {
      startDate: location.state.choiceDate[0],
      endDate: location.state.choiceDate[1],
    };

    if (true) {
      return;
    }

    axios
      .post("/api/main-schedule", insertParams)
      .then((res) => {
        console.log(axios.defaults.headers.common, "test");
        console.log(JSON.stringify(res.data.result));
        if (res.data.result === "suc") {
          alert("성공");
        } else if (res.data.result === "err") {
          alert("실패");
        }
      })
      .catch((err) => console.log("catch" + err));

    let taskParams = {};
    axios
      .post("/api/daily-schedule/task", taskParams)
      .then((res) => {
        console.log(axios.defaults.headers.common, "test");
        console.log(JSON.stringify(res.data.result));
        if (res.data.result === "suc") {
          alert("성공");
        } else if (res.data.result === "err") {
          alert("실패");
        }
      })
      .catch((err) => console.log("catch" + err));
  };

  const printDayList = () => {
    let dayInput = [];
    let k = [];
    for (let i = 0; i < dayGroup.length; i++) {
      dayInput.push(
        <div key={i} class="day">
          <label htmlFor={"dayInput-" + i}>{dayGroup[i]}</label>
          <input id={"dayInput-" + i} type="text" value={k[i]} />
        </div>
      );
    }

    console.log(k, "000");
    return dayInput;
  };

  return (
    <div className="dayInput">
      <div className="inner">
        <div className="title">일별 등록</div>

        <div className="dayList">{printDayList()}</div>
        <button className="insert" onClick={planInsert}>
          등록
        </button>
      </div>
    </div>
  );
};

export default Main;
