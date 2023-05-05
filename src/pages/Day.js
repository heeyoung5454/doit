import React, { useState } from "react";
import "../assets/main.scss";
import { useLocation, useNavigate } from "react-router-dom";
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
      taskList: [{ title: "", content: "", priority: "0" }],
    });
    idx++;
  }

  // 일별 task
  const [dayTask, setDayTask] = useState(dayGroup);

  // task 정보 설정
  const inputTask = (event, type) => {
    const dayIndex = event.i;
    const taskIndex = event.j;
    const value = event.e.target.value;

    setDayTask(
      dayTask.map((item) => {
        if (item.seqNo === dayIndex) {
          if (type === 0) {
            item.taskList[taskIndex].title = value;
          } else if (type === 1) {
            item.taskList[taskIndex].content = value;
          } else if (type === 2) {
            item.taskList[taskIndex].priority = value;
          }
        }
        return item;
      })
    );
  };

  // 화면 출력
  const printDayList = () => {
    let dayPrint = [];

    for (let i = 0; i < dayTask.length; i++) {
      dayPrint.push(
        <div key={dayTask[i].date} className="day-group">
          <div>{dayTask[i].date}</div>
          <button key={"btn-" + i} onClick={(e) => addTask({ e, i })}>
            추가
          </button>
        </div>
      );
      for (let j = 0; j < dayTask[i].taskList.length; j++) {
        dayPrint.push(
          <div key={"input" + dayTask[i].seqNo + "-" + j} className="day">
            <input
              className="title"
              id={"title-" + i + "-" + j}
              type="text"
              value={dayTask[i].taskList[j].title || ""}
              placeholder="제목"
              onChange={(e) => inputTask({ e, i, j }, 0)}
            />

            <input
              className="content"
              id={"content-" + i + "-" + j}
              type="text"
              value={dayTask[i].taskList[j].content || ""}
              placeholder="내용"
              onChange={(e) => inputTask({ e, i, j }, 1)}
            />

            <input
              className="priority"
              id={"priority-" + i + "-" + j}
              type="text"
              value={dayTask[i].taskList[j].priority || ""}
              placeholder="우선순위"
              onChange={(e) => inputTask({ e, i, j }, 2)}
            />
          </div>
        );
      }
    }

    const addTask = (event) => {
      const index = event.i;

      let addTask = { title: "", content: "", priority: "" };
      setDayTask(
        dayTask.map((item) => {
          if (item.seqNo === index) {
            item.taskList = [...item.taskList, addTask];
          }
          return item;
        })
      );
    };

    return dayPrint;
  };

  // 메인 일정등록 (API 호출)
  const planInsert = (event) => {
    // if (true) {
    //   return;
    // }

    console.log(event);
    //console.log(dayTask[event]);

    let insertParams = {
      startDate: location.state.choiceDate[0],
      endDate: location.state.choiceDate[1],
    };

    axios
      .post("/api/main-schedule", insertParams)
      .then((res) => {
        console.log(axios.defaults.headers.common, "test");
        console.log(JSON.stringify(res.data.result));
        if (res.data.result === "suc") {
          for (let i = 0; i < dayTask.length; i++) {
            dailyInsert(res.data.data, dayTask[i].date, dayTask[i].taskList);
          }
        } else if (res.data.result === "err") {
          alert("스케줄 등록에 실패하셨습니다.");
          return;
        }
      })
      .catch((err) => console.log("catch" + err));
  };

  const pageMove = useNavigate();

  // 일별 일정등록 (API 호출)
  const dailyInsert = (mainId, date, taskList) => {
    let dayTaskParams = {
      mainScheduleId: mainId,
      date: date,
      taskScheduleFormList: taskList,
    };

    axios
      .post("/api/daily-schedule/task", dayTaskParams)
      .then((res) => {
        if (res.data.result === "suc") {
          alert("스케줄 등록 성공하였습니다");
        } else if (res.data.result === "err") {
          alert("스케줄 등록에 실패하셨습니다.");
          return;
        }
      })
      .catch((err) => alert(JSON.stringify(err)))
      .finally(() =>
        // 등록 성공시 메인 페이지 이동
        pageMove("/main")
      );
  };

  return (
    <div className="dayInput">
      <div className="inner">
        <div className="title">일별 등록</div>
        >>{JSON.stringify(dayTask)}
        <div className="dayList">{printDayList()}</div>
        <button className="insert" onClick={planInsert}>
          등록
        </button>
      </div>
    </div>
  );
};

export default Main;
