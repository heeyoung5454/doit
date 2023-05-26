import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/taskAdd.scss";

const TaskAdd = () => {
  const location = useLocation();
  const pageMove = useNavigate();

  let date = location.state.date;
  let detailTaskList = location.state.taskList;
  let dayTask = [{ title: "", content: "", priority: "1" }];

  // 일별 task
  const [dayTaskList, setDayTaskList] = useState(dayTask);

  // task 정보 설정
  const inputTask = (event, type, direct) => {
    const taskIndex = event.j;
    const value = event.e.target.value;

    setDayTaskList(
      dayTaskList.map((item, index) => {
        if (index === taskIndex) {
          if (type === 0) {
            item.title = value;
          } else if (type === 1) {
            item.content = value;
          } else if (type === 2) {
            if (direct === "down") {
              if (item.priority === 1) {
                return item;
              }
              item.priority = Number(item.priority) - 1;
            } else {
              item.priority = Number(item.priority) + 1;
            }
          }
        }

        return item;
      })
    );
  };

  // 화면 출력
  const printDayList = () => {
    let dayPrint = [];

    for (let j = 0; j < dayTaskList.length; j++) {
      dayPrint.push(
        <div key={"input" + dayTaskList + "-" + j} className="day">
          <input
            className="title"
            id={"title-" + j}
            type="text"
            value={dayTaskList[j].title || ""}
            placeholder="제목"
            onChange={(e) => inputTask({ e, j }, 0)}
          />

          <input
            className="content"
            id={"content-" + j}
            type="text"
            value={dayTaskList[j].content || ""}
            placeholder="내용"
            onChange={(e) => inputTask({ e, j }, 1)}
          />

          <input
            className="priority"
            id={"priority-" + j}
            type="text"
            value={dayTaskList[j].priority || ""}
            placeholder="우선순위"
            onChange={(e) => inputTask({ e, j }, 2)}
          />

          <div
            className="up"
            onClick={(e) => inputTask({ e, j }, 2, "up")}
          ></div>
          <div
            className="down"
            onClick={(e) => inputTask({ e, j }, 2, "down")}
          ></div>
        </div>
      );
    }

    dayPrint.push(
      <div key={date} className="day-group">
        <button key={"btn-add"} className="add" onClick={(e) => addTask({ e })}>
          추가
        </button>
      </div>
    );

    const addTask = () => {
      let addTask = {
        title: "",
        content: "",
        priority: dayTaskList.length + 1,
      };
      setDayTaskList([...dayTaskList, addTask]);
    };
    return dayPrint;
  };

  // 일별 일정등록 (API 호출)
  const dailyInsert = () => {
    for (let i = 0; i < dayTaskList.length; i++) {
      if (
        !dayTaskList[i].title ||
        !dayTaskList[i].content ||
        !dayTaskList[i].priority
      ) {
        alert("필수값을 입력해주세요");
        return;
      }
    }

    let dayTaskParams = {
      mainScheduleId: location.state.mainId,
      date: date,
      taskScheduleFormList: dayTaskList,
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
    <div className="taskAdd">
      <div className="inner">
        {JSON.stringify(dayTaskList)}
        <div>{date}</div>
        <div className="dayList">{printDayList()}</div>
        <button className="insert" onClick={(taskList) => dailyInsert()}>
          등록
        </button>

        <hr />
        <div>{JSON.stringify(detailTaskList)}</div>
      </div>
    </div>
  );
};

export default TaskAdd;
