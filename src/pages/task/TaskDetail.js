import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/detail.scss";

const TaskDetail = () => {
  const [detail, setDetail] = useState([]);
  const location = useLocation();
  const pageMove = useNavigate();

  let mainScheduleId = location.state.mainScheduleId;

  // 메인 스케줄의 일별 과제 스케줄 조회 함수
  const getDailyTasks = (data) => {
    setDetail(data);
  };

  // useEffect -> 화면 렌더링 되기 전 실행
  useEffect(() => {
    // 메인 스케줄의 일별 과제 스케줄 조회
    axios
      .get(`/api/daily-task-schedule/${mainScheduleId}`)
      .then((res) => {
        if (res.data.result === "suc") {
          getDailyTasks(res.data.data);
        } else if (res.data.result === "err") {
          alert("스케줄 조회에 실패하셨습니다.");
        }
      })
      .catch((err) => console.log("catch" + err));
  }, [mainScheduleId]);

  const printDetail = () => {
    let detailTask = [];
    console.log(detail);
    for (let i = 0; i < detail.length; i++) {
      detailTask.push(
        <div key={detail[i].dailyScheduleId} className="date">
          {detail[i].date}
        </div>
      );

      for (let j = 0; j < detail[i].taskSchedules.length; j++) {
        detailTask.push(
          <div
            key={detail[i].taskSchedules[j].taskScheduleId}
            className="task-schedule"
          >
            <div>우선순위 : {detail[i].taskSchedules[j].priority}</div>
            <div>제목 : {detail[i].taskSchedules[j].title}</div>
            <div>내용 : {detail[i].taskSchedules[j].content}</div>
            <div>완료여부 : {detail[i].taskSchedules[j].complete}</div>

            <div> 진행도 : {detail[i].taskSchedules[j].percent}</div>
          </div>
        );
      }
      detailTask.push(
        <button
          key={detail[i].dailyScheduleId}
          onClick={() => moveAddPage(detail[i].date)}
          className="insert"
        >
          등록
        </button>
      );
    }

    const moveAddPage = (choiceDate) => {
      pageMove("/taskAdd", {
        state: {
          date: choiceDate,
          mainId: mainScheduleId,
        },
      });
    };

    return (
      <div>
        <h2> 일별 상세화면</h2>
        <div className="content">{detailTask}</div>
      </div>
    );
  };

  return <div className="task-detail">{printDetail()}</div>;
};

export default TaskDetail;
