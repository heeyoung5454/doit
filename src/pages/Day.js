import React, { useState } from "react";
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
  let idx = 0; //  seqNo 지정

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

    dayGroup.push({
      seqNo: idx,
      date: fullDate,
      taskList: [{ title: "", content: "", priority: "" }],
    });
    idx++;
  }

  // 일정등록
  const planInsert = (event) => {
    console.log(event);
    console.log(dayTask[event.i]);

    let insertParams = {
      startDate: location.state.choiceDate[0],
      endDate: location.state.choiceDate[1],
    };

    let mainId;

    axios
      .post("/api/main-schedule", insertParams)
      .then((res) => {
        console.log(axios.defaults.headers.common, "test");
        console.log(JSON.stringify(res.data.result));
        if (res.data.result === "suc") {
          mainId = res.data.mainId;
          alert("성공");
        } else if (res.data.result === "err") {
          alert("실패");
          return;
        }
      })
      .catch((err) => console.log("catch" + err));

    let dayTaskParams = {
      mainScheduleId: mainId,
      date: dayTask[event.i].date,
      taskScheduleFormList: dayTask[event.i].taskList,
    };

    axios
      .post("/api/daily-schedule/task", dayTaskParams)
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

  // 일별 task
  const [dayTask, setDayTask] = useState(dayGroup);

  const inputTask = (event) => {
    const index = event.i;
    const value = event.e.target.value;

    setDayTask(
      dayTask.map((item) => {
        if (item.seqNo === index) {
          let temp = [{ title: value, content: "test", priority: "0" }];

          return {
            ...item,
            taskList: temp,
          };
        } else {
          return item;
        }
      })
    );
  };

  const printDayList = () => {
    let dayPrint = [];

    for (let i = 0; i < dayTask.length; i++) {
      dayPrint.push(
        <div key={i} className="day">
          <label htmlFor={"dayInput-" + i}>{dayTask[i].date}</label>
          <input
            id={"dayInput-" + i}
            type="text"
            value={dayTask[i].taskList[0].title || ""}
            onChange={(e) => inputTask({ e, i })}
          />

          <button className="insert" onClick={(e) => planInsert({ i })}>
            등록
          </button>
        </div>
      );
    }

    return dayPrint;
  };

  return (
    <div className="dayInput">
      <div className="inner">
        {JSON.stringify(dayTask)}
        <div className="title">일별 등록</div>
        <div className="dayList">{printDayList()}</div>
        {/*<button className="insert" onClick={planInsert}>*/}
        {/*  등록*/}
        {/*</button>*/}
      </div>
    </div>
  );
};

export default Main;
