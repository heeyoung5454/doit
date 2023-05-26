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

    console.log(detailDate, "detailDate");

    for (let i = 0; i < detailDate.length; i++) {
      for (let j = 0; j < detailTask.length; j++) {
        console.log(detailDate[i], "tttt", detailTask[j].date);
        console.log(detailDate[i], "fff", detailTask[j]);

        // 일정이 이미 등록된 경우
        if (detailDate[i] === detailTask[j].date) {
          for (let k = 0; k < detailTask[j].taskSchedules.length; k++) {
            console.log(detailTask[j].taskSchedules, "fff");

            detailTaskList.push(
              <div
                key={
                  detailTask[j].dailyScheduleId +
                  "-" +
                  detailTask[j].taskSchedules[k].taskScheduleId
                }
              >
                <div>{detailDate[i]}</div>
                <div className="task-schedule-list">
                  <div>제목 : {detailTask[j].taskSchedules[k].title}</div>
                  <div>내용 : {detailTask[j].taskSchedules[k].content}</div>
                  <div>
                    완료여부 : {detailTask[j].taskSchedules[k].complete}
                  </div>
                  <div>진행도 :{detailTask[j].taskSchedules[k].percent}</div>
                  <button
                    key={detailDate + "insert"}
                    className="insert"
                    onClick={() =>
                      moveAddPage(detailDate[i], detailTask[j].taskSchedules[k])
                    }
                  >
                    수정
                  </button>
                </div>
              </div>
            );
          }
        }
        // 일정이 미등록된 경우
        else {
          detailTaskList.push(
            <div key={detailDate[i] + "=" + i}>
              <div>{detailDate[i]}</div>

              <div className="task-schedule-list">
                <div>등록된 일정이 없습니다</div>
                <button
                  key={detailDate + "insert"}
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

    const moveAddPage = (choiceDate, taskList) => {
      pageMove("/taskAdd", {
        state: {
          date: choiceDate,
          mainId: mainScheduleId,
          taskList: taskList,
        },
      });
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
