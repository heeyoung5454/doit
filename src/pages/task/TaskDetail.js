import { useEffect, useState } from "react";
import http from "utile/http";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/detail.scss";
import Header from "../../layout/header";

const TaskDetail = () => {
  const [detailTask, setDetailTask] = useState([]);
  const [detailDate, setDetailDate] = useState([]);

  const [changePercent, setChangePercent] = useState(0);

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
    http
      .get(`/daily-task-schedule/${mainScheduleId}`)
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
            let percent = detailTask[j].taskSchedules[k].percent; // 변경할 진행률

            detailTaskList.push(
              <div
                key={
                  detailTask[j].dailyScheduleId +
                  "-" +
                  detailTask[j].taskSchedules[k].taskScheduleId
                }
                className="task-schedule-list"
              >
                <div className="summary">
                  <div>제목 : {detailTask[j].taskSchedules[k].title}</div>
                  <div>내용 : {detailTask[j].taskSchedules[k].content}</div>

                  <input
                    type="Number"
                    name="percent"
                    placeholder="진행률"
                    defaultValue={detailTask[j].taskSchedules[k].percent}
                    onChange={(e) => {
                      percent = e.target.value;
                    }}
                  />

                  <button
                    className="complete"
                    onClick={() =>
                      updatePercent(
                        detailTask[j].taskSchedules[k].taskScheduleId,
                        percent
                      )
                    }
                  >
                    진행률 변경
                  </button>
                </div>
                <div
                  className="percent-bar"
                  onMouseUp={(e) => {
                    percent = Math.floor(
                      ((e.clientX - 50) / e.target.offsetWidth) * 100
                    );
                    setChangePercent(percent);

                    updatePercent(
                      detailTask[j].taskSchedules[k].taskScheduleId,
                      percent
                    );
                  }}
                >
                  <div className="now" style={{ width: percent + "%" }}></div>
                </div>
                {percent}//{changePercent}
                <div className="percent">
                  {detailTask[j].taskSchedules[k].complete === "N"
                    ? detailTask[j].taskSchedules[k].percent +
                      "% 진행 중 입니다."
                    : "완료되었습니다."}
                </div>
              </div>
            );
          }
        }
        // 일정이 미등록된 경우
        else {
          detailTaskList.push(
            <div key={detailDate[i] + "-" + j}>
              <div className="task-schedule-list">
                <div>{detailDate[i]}</div>
                <div className="summary">
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

    // 할일 진행도 변경
    const updatePercent = (taskId, percent) => {
      http
        .patch(`task-schedule/${taskId}/${percent}`)
        .then((res) => {
          if (res.data.result === "suc") {
            alert("성공");
            window.location.reload();
          } else if (res.data.result === "err") {
            alert("통신에러 발생했습니다");
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

  return (
    <div>
      <Header />
      <div className="task-detail">{printDetail()}</div>
    </div>
  );
};

export default TaskDetail;
