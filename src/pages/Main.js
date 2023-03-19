import React, { useState } from "react";
//import React from "react";
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
import { isSameMonth, isSameDay, addDays, parse } from "date-fns";
import "../assets/main.scss";

// reference site https://sennieworld.tistory.com/74

const CalHeader = ({ nowMonth, prevMonth, nextMonth }) => {
  return (
    <div className="header">
      <div className="col col-start">
        <span className="text">
          <span className="month">
            {format(nowMonth, "M")}
            <span className="eng">
              {nowMonth.toLocaleString("en-US", { month: "long" })}
            </span>
          </span>

          <span className="year">{format(nowMonth, "yyyy")}</span>
        </span>
      </div>
      <div className="col col-end">
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
      <div className="col" key={i}>
        {date[i]}
      </div>
    );
  }

  return <div className="day row">{days}</div>;
};

const CalCell = ({ nowMonth, selectDate, onDateClick }) => {
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
      const cloneDay = day;
      days.push(
        <div
          className={`col cell ${
            !isSameMonth(day, monthStart)
              ? "disabled"
              : isSameDay(day, selectDate)
              ? "selected"
              : format(nowMonth, "M") !== format(day, "M")
              ? "not-valid"
              : "valid"
          }`}
          key={day}
          onClick={() => onDateClick(parse(cloneDay))}
        >
          <span
            className={
              format(nowMonth, "M") !== format(day, "M") ? "text not-vaild" : ""
            }
          >
            {formattedDate}
          </span>
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
  return <div className="body">{rows}</div>;
};

const Main = () => {
  // const today = new Date();
  //
  const [nowMonth, setNowMonth] = useState(new Date());
  const [selectDate, setSelectDate] = useState(new Date());

  const prevMonth = () => {
    setNowMonth(subMonths(nowMonth, 1));
  };

  const nextMonth = () => {
    setNowMonth(addMonths(nowMonth, 1));
  };

  const onDateClick = (day) => {
    setSelectDate(day);
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
      />
    </div>
  );
};

export default Main;
