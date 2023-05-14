import React from "react";
import "../assets/main.scss";
import { useLocation, useNavigate } from "react-router-dom";
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
    });
    idx++;
  }

  // // 일별 task
  // const [dayTask, setDayTask] = useState(dayGroup);

  const pageMove = useNavigate();

  // 화면 출력
  const printDayList = () => {
    let dayPrint = [];

    for (let i = 0; i < dayGroup.length; i++) {
      dayPrint.push(
        <div key={dayGroup[i].date} className="day-group">
          <div>{dayGroup[i].date}</div>
          <button
            className="insert"
            onClick={() => moveAddPage(dayGroup[i].date)}
          >
            이동
          </button>
        </div>
      );
    }

    return dayPrint;
  };

  const moveAddPage = (choiceDate) => {
    pageMove("/taskAdd", {
      state: {
        date: choiceDate,
        mainId: location.state.mainId,
      },
    });
  };

  return (
    <div className="dayInput">
      <div className="inner">
        <div className="title">
          {location.state.choiceDate[0]} ~ {location.state.choiceDate[1]}
        </div>
        <div className="dayList">{printDayList()}</div>
      </div>
    </div>
  );
};

export default Main;
