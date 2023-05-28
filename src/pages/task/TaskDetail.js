import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/detail.scss";

const TaskDetail = () => {
  const [detailTask, setDetailTask] = useState([]);
  const [detailDate, setDetailDate] = useState([]);
  const location = useLocation();
  const pageMove = useNavigate();

  let mainScheduleId = location.state.mainScheduleId;

  // 메인 스케줄의 일별 과제 스케줄 조회 함수
  const getDailyTasks = (data) => {
    setDetailTask(data);
  };

  // 메인 스케줄의 날짜 리스트 설정
  const getDateList = (data) => {
    setDetailDate(data);
  };

  // useEffect -> 화면 렌더링 되기 전 실행
  useEffect(() => {
    // 메인 스케줄의 일별 과제 스케줄 조회
    axios
      .get(`/api/daily-task-schedule/${mainScheduleId}`)
      .then((res) => {
        if (res.data.result === "suc") {
          getDailyTasks(res.data.data.dailyTaskScheduleList);
          getDateList(res.data.data.dates);
        } else if (res.data.result === "err") {
          alert("스케줄 조회에 실패하셨습니다.");
        }
      })
      .catch((err) => console.log("catch" + err));
  }, [mainScheduleId]);

  const printDetail = () => {
    let detailTaskList = [];
    console.log("detailContent", detailTask);
    console.log("detailDate", detailDate);
    // Task가 하나도 없을 경우
    if (detailTask.length === 0) {
      for (let i = 0; i < detailDate.length; i++) {
        detailTaskList.push(
          <div key={detailDate[i]} className="task-schedule-list">
            <div>{detailDate[i]}</div>
            <button
              key={detailDate[i] + "insert"}
              className="insert"
              onClick={() => moveAddPage(detailDate[i])}
            >
              등록
            </button>
          </div>
        );
      }
    }

    for (let i = 0; i < detailDate.length; i++) {
      // Task가 한개 이상
      for (let j = 0; j < detailTask.length; j++) {
        // 일정이 이미 등록된 경우
        if (detailDate[i] === detailTask[j].date) {
          detailTaskList.push(
            <div className="detail-title">
              <div>{detailDate[i]}</div>
              <button
                key={detailDate[i] + "insert"}
                className="insert"
                onClick={() => moveAddPage(detailDate[i], detailTask[j])}
              >
                수정
              </button>
            </div>
          );
          for (let k = 0; k < detailTask[j].taskSchedules.length; k++) {
            detailTaskList.push(
              <div
                key={
                  detailTask[j].dailyScheduleId +
                  "-" +
                  detailTask[j].taskSchedules[k].taskScheduleId
                }
                className="task-schedule-list"
              >
                <div>제목 : {detailTask[j].taskSchedules[k].title}</div>
                <div>내용 : {detailTask[j].taskSchedules[k].content}</div>
                <div>완료여부 : {detailTask[j].taskSchedules[k].complete}</div>
                <div>진행도 :{detailTask[j].taskSchedules[k].percent}</div>
                <button
                  className="complete"
                  onClick={() =>
                    completeTask(
                      detailTask[j].taskSchedules[k].taskScheduleId,
                      detailTask[j].taskSchedules[k].complete
                    )
                  }
                >
                  {detailTask[j].taskSchedules[k].complete === "N"
                    ? "진행중"
                    : "완료"}
                </button>
              </div>
            );
          }
        }
        // 일정이 미등록된 경우
        else {
          detailTaskList.push(
            <div key={detailDate[i] + "-" + j}>
              <div>{detailDate[i]}</div>

              <div className="task-schedule-list">
                <div>등록된 일정이 없습니다</div>
                <button
                  key={detailDate[i] + "insert"}
                  className="insert"
                  onClick={() => moveAddPage(detailDate[i])}
                >
                  등록
                </button>
              </div>
            </div>
          );
        }
      }
    }

    const moveAddPage = (choiceDate, taskItem) => {
      pageMove("/taskUpdate", {
        state: {
          date: choiceDate,
          mainId: mainScheduleId,
          detailTaskItem: taskItem ? taskItem : null,
        },
      });
    };

    // 할일 완료
    const completeTask = (taskId, _complete) => {
      // 현재 상태값과 반대의 상태값으로 파라미터값 세팅
      let complete = "";

      if (_complete === "N") {
        complete = "Y";
      } else if (_complete === "Y") {
        complete = "N";
      }

      axios
        .patch(`/api/${taskId}/${complete}`)
        .then((res) => {
          if (res.data.result === "suc") {
            alert("성공");
          } else if (res.data.result === "err") {
            alert("스케줄 조회에 실패하셨습니다.");
          }
        })
        .catch((err) => console.log("catch" + err));
    };

    return (
      <div>
        <h2> 일별 상세화면</h2>
        <div className="content">{detailTaskList}</div>
      </div>
    );
  };

  return <div className="task-detail">{printDetail()}</div>;
};

export default TaskDetail;
