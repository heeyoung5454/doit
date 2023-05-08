import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { isSameMonth, isSameDay, addDays } from "date-fns";
import "../assets/main.scss";
import axios from "axios";

// reference site https://sennieworld.tistory.com/74

const CalHeader = ({ nowMonth, prevMonth, nextMonth }) => {
  return (
    <div className="header">
      <div className="title">
        <span className="month">
          {format(nowMonth, "M")}
          <span className="eng">
            {nowMonth.toLocaleString("en-US", { month: "long" })}
          </span>
        </span>

        <span className="year">{format(nowMonth, "yyyy")}</span>
      </div>
      <div className="arrow">
        <Icon icon="bi:arrow-left-circle-fill" onClick={prevMonth} />
        <Icon icon="bi:arrow-right-circle-fill" onClick={nextMonth} />
      </div>
    </div>
  );
};

const CalDays = () => {
  const days = [];
  const date = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  for (let i = 0; i < 7; i++) {
    days.push(
      <div className="week" key={i}>
        {date[i]}
      </div>
    );
  }

  return <div className="day row">{days}</div>;
};

const getMainScheduleId = (allTasked, nowDate) => {
  for (let i = 0; i < allTasked.length; i++) {
    let stDate = new Date(
      new Date(allTasked[i].startDate).setHours(0, 0, 0, 0)
    );
    let endDate = new Date(new Date(allTasked[i].endDate).setHours(0, 0, 0, 0));

    if (
      nowDate.getTime() >= stDate.getTime() &&
      nowDate.getTime() <= endDate.getTime()
    ) {
      return allTasked[i].mainScheduleId;
    }
  }

  return false;
};

const CalCell = ({
  nowMonth,
  selectDate,
  onDateClick,
  allTasked,
  detailClick,
}) => {
  const monthStart = startOfMonth(nowMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let j = 0; j < 7; j++) {
      formattedDate = format(day, "d");
      // day를 직접적으로 사용하면 무한루프 돌기 때문에 지역변수로 선언하여 사용
      const cloneDay = day;

      days.push(
        <div
          className={`cell ${
            !isSameMonth(day, monthStart)
              ? "disabled"
              : isSameDay(day, selectDate)
              ? "selected"
              : format(nowMonth, "M") !== format(day, "M")
              ? "not-valid"
              : "valid"
          }`}
          key={day}
          onClick={() => onDateClick(cloneDay)}
        >
          <span
            className={
              format(nowMonth, "M") !== format(day, "M")
                ? "not-vaild daily"
                : "daily"
            }
          >
            {formattedDate}
          </span>
          <span
            className={getMainScheduleId(allTasked, day) > 0 ? "check" : ""}
            onClick={() => detailClick(allTasked, cloneDay)}
          ></span>
        </div>
      );

      day = addDays(day, 1);
    }

    rows.push(
      <div className="row" key={day}>
        {days}
      </div>
    );
    days = [];
  }
  return <div className="body">{rows} </div>;
};

const Main = () => {
  const [nowMonth, setNowMonth] = useState(new Date());
  const [mainTask, setMainTask] = useState([]);

  // 메인 스케줄 조회 함수
  const getMainTask = (data) => {
    setMainTask(data);
  };

  // useEffect -> 화면 렌더링 되기 전 실행
  useEffect(() => {
    let paramsYear = format(nowMonth, "yyyy");
    let paramsMonth = format(nowMonth, "MM");

    // 메인 스케줄 조회
    axios
      .get(`/api/main-schedule/${paramsYear}/${paramsMonth}`)
      .then((res) => {
        if (res.data.result === "suc") {
          getMainTask(res.data.data);
        } else if (res.data.result === "err") {
          alert("스케줄 조회에 실패하셨습니다.");
        }
      })
      .catch((err) => console.log("catch" + err));
  }, [nowMonth]);

  const [selectDate, setSelectDate] = useState(new Date());
  const [choiceFullList, setChoiceFullList] = useState([]);

  const prevMonth = () => {
    setNowMonth(subMonths(nowMonth, 1));
  };

  const nextMonth = () => {
    setNowMonth(addMonths(nowMonth, 1));
  };

  const onDateClick = (day) => {
    let convertDay = new Date(day);

    setSelectDate(day);

    let month = convertDay.getMonth() + 1;
    let date = convertDay.getDate();

    if (month < 10) {
      month = "0" + month;
    }

    if (date < 10) {
      date = "0" + date;
    }

    let fullDate =
      convertDay.getFullYear() + "-" + month.toString() + "-" + date.toString();

    // 현재 있는 choiceFullList가 1개이하라면 그냥 푸시
    if (choiceFullList.length <= 2) {
      if (choiceFullList.length === 0) {
        // 시작일과 종료일 모두 미셋팅 -> 무조건 푸시
        setChoiceFullList([...choiceFullList, fullDate]);
      } else if (choiceFullList.length === 1) {
        // 한개 날짜가 지정되어있을 경우, 비교해서 넣기
        if (new Date(fullDate) > new Date(choiceFullList[0])) {
          setChoiceFullList([...choiceFullList, fullDate]);
        } else {
          setChoiceFullList([fullDate, ...choiceFullList]);
        }
      } else {
        // 시작일과 종료일 셋팅 완료 됬을 경우 선택값 초기화 후 시작일로 무조건 셋팅
        setChoiceFullList([]);
        choiceFullList[0] = fullDate;
      }
    }
  };

  const pageMove = useNavigate();

  const moveUrl = (type, allTask, date) => {
    if (type === "add") {
      if (choiceFullList.length < 2 || choiceFullList == null) {
        alert("날짜를 선택해주세요");
        return;
      }

      pageMove("/day", {
        state: {
          choiceDate: choiceFullList,
        },
      });
    } else if (type === "detail") {
      let mainId = getMainScheduleId(allTask, date);

      pageMove("/detail", {
        state: {
          mainScheduleId: mainId,
        },
      });
    }
  };

  return (
    <div className="calendar">
      <CalHeader
        nowMonth={nowMonth}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />
      <CalDays />
      <CalCell
        nowMonth={nowMonth}
        selectDate={selectDate}
        onDateClick={onDateClick}
        allTasked={mainTask}
        detailClick={(allTask, date) => moveUrl("detail", allTask, date)}
      />
      <div className="set-date">
        <div>시작일 : {choiceFullList[0]}</div>
        <div>종료일 : {choiceFullList[1]}</div>
      </div>
      <button className="next" onClick={() => moveUrl("add")}>
        등록하기
      </button>
    </div>
  );
};

export default Main;
