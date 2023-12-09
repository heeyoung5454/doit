import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import http from "utile/http";
import "../../assets/taskUpdate.scss";
import Header from "../../layout/header";

const TaskUpdate = () => {
  const location = useLocation();
  const pageMove = useNavigate();

  let date = location.state.date;
  let detailTaskItem = location.state.detailTaskItem;
  let dayTask = [{ title: "", content: "", priority: "1" }];

  // 이미 등록된 task가 있을 경우 >> 수정 페이지 & 초기값 설정
  if (detailTaskItem) {
    dayTask = detailTaskItem.taskSchedules;
  }

  // 일별 task
  const [dayTaskList, setDayTaskList] = useState(dayTask);
  const [delTaskList, setDelTaskList] = useState([]);

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

  const deleteTask = (event, taskScheduleId) => {
    const taskIndex = event.j;

    // taskScheduleId 있을 경우 (=기존에 등록된 경우) delTaskList에 추가
    if (taskScheduleId) {
      setDelTaskList([...delTaskList, taskScheduleId]);
    }

    // 현재 선택한 인덱스 제거하여 dayTaskList 셋팅 (화면 동기화)
    setDayTaskList(dayTaskList.filter((item, index) => index !== taskIndex));
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

          <button
            className="delete"
            onClick={(e) => deleteTask({ e, j }, dayTaskList[j].taskScheduleId)}
          >
            삭제
          </button>
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

    if (!dayTaskList || dayTaskList.length === 0) {
      alert("최소 1개 이상의 일정을 등록해주세요");
      return;
    }

    let dayTaskParams = {
      mainScheduleId: location.state.mainId,
      date: date,
      taskScheduleFormList: dayTaskList,
    };

    http
      .post("/daily-schedule/task", dayTaskParams)
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

  // 일별 일정수정 (API 호출)
  const dailyUpdate = () => {
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

    let saveList = []; // 추가할 task
    let updateList = []; // 수정할 task
    for (let i = 0; i < dayTaskList.length; i++) {
      // id가 있다 >> 기존 task (수정)
      if (dayTaskList[i].taskScheduleId) {
        updateList.push(dayTaskList[i]);
      }
      // id가 없다 >> 신규 task (추가)
      else {
        saveList.push(dayTaskList[i]);
      }
    }

    let dayTaskParams = {
      // 삭제할 task
      deleteTaskList: delTaskList,
      // 추가할 task
      saveTaskList: saveList,
      // 수정할 task (변경사항 없어도 포함)
      updateTaskList: updateList,
    };

    let dailyScheduleId = detailTaskItem.dailyScheduleId;

    http
      .post(`/task-schedule/${dailyScheduleId}`, dayTaskParams)
      .then((res) => {
        if (res.data.result === "suc") {
          alert("스케줄 수정 성공하였습니다");
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
    <div>
      <Header />
      <div className="taskAdd">
        <div className="inner">
          <div>{date}</div>
          <div className="dayList">{printDayList()}</div>

          {detailTaskItem ? (
            <button className="update" onClick={(taskList) => dailyUpdate()}>
              수정
            </button>
          ) : (
            <button className="insert" onClick={(taskList) => dailyInsert()}>
              등록
            </button>
          )}

          <hr />
        </div>
      </div>
    </div>
  );
};

export default TaskUpdate;
