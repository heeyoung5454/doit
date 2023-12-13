import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { isSameMonth, isSameDay, addDays } from "date-fns";
import "../assets/main.scss";
import http from "utile/http";
import Header from "../layout/header";
import SearchPop from "../pages/friend/searchPopl";
import BlockList from "./friend/BlockList";

// reference site https://sennieworld.tistory.com/74

const CalHeader = ({ nowMonth, prevMonth, nextMonth }) => {
  return (
    <div className='header'>
      <div className='title'>
        <span className='month'>
          {format(nowMonth, "M")}
          <span className='eng'>{nowMonth.toLocaleString("en-US", { month: "long" })}</span>
        </span>

        <span className='year'>{format(nowMonth, "yyyy")}</span>
      </div>
      <div className='arrow'>
        <Icon icon='bi:arrow-left-circle-fill' onClick={prevMonth} />
        <Icon icon='bi:arrow-right-circle-fill' onClick={nextMonth} />
      </div>
    </div>
  );
};

const CalDays = () => {
  const days = [];
  const date = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  for (let i = 0; i < 7; i++) {
    days.push(
      <div className='week' key={i}>
        {date[i]}
      </div>
    );
  }

  return <div className='day row'>{days}</div>;
};

const getMainScheduleId = (allTasked, nowDate) => {
  for (let i = 0; i < allTasked.length; i++) {
    let stDate = new Date(new Date(allTasked[i].startDate).setHours(0, 0, 0, 0));
    let endDate = new Date(new Date(allTasked[i].endDate).setHours(0, 0, 0, 0));

    if (nowDate.getTime() >= stDate.getTime() && nowDate.getTime() <= endDate.getTime()) {
      return allTasked[i].mainScheduleId;
    }
  }

  return false;
};

const CalCell = ({ nowMonth, isInsertIng, selectDate, overList, choiceFullList, drag, allTasked, detailClick }) => {
  const monthStart = startOfMonth(nowMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const [title, setTitle] = useState("새로운 이벤트"); // 스케줄 제목

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let j = 0; j < 7; j++) {
      formattedDate = format(day, "d");
      // day를 직접적으로 사용하면 무한루프 돌기 때문에 지역변수로 선언하여 사용
      const cloneDay = day;
      const startDay = new Date(choiceFullList[0]);
      const endDay = new Date(choiceFullList[1]);

      let overStartDay = null;
      let overEndDay = null;

      if (overList.length > 0) {
        overStartDay = new Date(overList[0]);
        overEndDay = new Date(overList[overList.length - 1]);
      }

      let fullEndDay = "";
      if (choiceFullList[1]) {
        fullEndDay = format(endDay, "Y") + "." + format(endDay, "M") + "." + format(endDay, "d");
      }

      days.push(
        <div
          className={`cell ${!isSameMonth(day, monthStart) ? "disabled" : isSameDay(day, selectDate) ? "selected" : format(nowMonth, "M") !== format(day, "M") ? "not-valid" : "valid"}`}
          key={day}
          onMouseDown={() => drag(cloneDay, "start")}
          onMouseUp={() => drag(cloneDay, "end")}
          onMouseOver={() => drag(cloneDay, "over")}
        >
          {startDay.getDate() === Number(formattedDate) && isSameMonth(day, startDay) && isSameMonth(day, endDay) && (
            <div className='box'>
              <div>
                <input id='title' type='text' name='title' placeholder='새로운 이벤트' value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                {format(startDay, "Y")}.{format(startDay, "M")}.{format(startDay, "d")} ~{fullEndDay}
              </div>
            </div>
          )}

          <span className={format(nowMonth, "M") !== format(day, "M") ? "not-vaild daily" : "daily"}>{formattedDate}</span>
          <span className={getMainScheduleId(allTasked, day) > 0 ? "check" : ""} onClick={() => detailClick(allTasked, cloneDay)}></span>

          {overStartDay && overEndDay && (
            <span
              className={
                (Number(format(overEndDay, "M")) >= Number(format(day, "M")) &&
                  Number(format(overStartDay, "M")) === Number(format(day, "M")) &&
                  Number(format(startDay, "d")) === Number(format(day, "d")) &&
                  Number(format(startDay, "M")) === Number(format(day, "M"))) ||
                (Number(format(overStartDay, "d")) <= Number(format(day, "d")) && Number(format(overEndDay, "d")) >= Number(format(day, "d")))
                  ? "over"
                  : ""
              }
            ></span>
          )}
        </div>
      );

      day = addDays(day, 1);
    }

    rows.push(
      <div className='row' key={day}>
        {days}
      </div>
    );
    days = [];
  }

  return <div className='body'>{rows}</div>;
};

// 친구 목록
const FriendList = () => {
  const [followingList, setFollowingList] = useState([]);
  const [followBackList, setFollowBackList] = useState([]);

  // 친구 목록 불러오기 :: 화면 랜더링 전에 실행
  useEffect(() => {
    http
      .get("/friends")
      .then((res) => {
        if (res.data.result === "suc") {
          // 친구 리스트 설정
          setFollowingList(res.data.data.followingList);
          setFollowBackList(res.data.data.followBackList);
        } else if (res.data.result === "err") {
          alert("친구 목록 불러오기 실패하였습니다");
          return;
        }
      })
      .catch((err) => console.log("catch :: " + err));
  }, []);

  // 모달창 제어(친구 팝업)
  const [modalOpen, setModalOpen] = useState(false); // 팝업 호출
  //const [modalMsg, setModalMsg] = useState(""); // 팝업 메세지

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const [isBlockOpen, setIsBlockOpen] = useState(false); // 팝업 호출

  const openBlockList = () => {
    setIsBlockOpen(true);
  };

  const closeBlockList = () => {
    setIsBlockOpen(false);
  };

  // 팔로우 취소
  const followCancel = (friendId) => {
    http
      .post("/friends/cancel?friendId=" + friendId)
      .then((res) => {
        if (res.data.result === "suc") {
          alert("팔로우를 취소하였습니다.");
        } else if (res.data.result === "err") {
          alert("팔로우를 취소 실패하셨습니다.");
        }
      })
      .catch((err) => console.log("catch" + err))
      .finally(() => {
        window.location.replace("/main");
      });
  };

  const getFollowingList = [];
  const getFollowBackList = [];

  for (let i = 0; i < followingList.length; i++) {
    getFollowingList.push(
      <div className='friend-item' key={i}>
        <span>{followingList[i].nickname}</span>
        <button className='cancel' onClick={() => followCancel(followingList[i].friendId)}>
          팔로잉 취소
        </button>
      </div>
    );
  }

  for (let j = 0; j < followBackList.length; j++) {
    getFollowBackList.push(
      <div className='friend-item' key={j}>
        <span>{followBackList[j].nickname}</span>
      </div>
    );
  }

  return (
    <div className='friend-list'>
      <div>
        <h2>친구 목록</h2>
        <button className='block-btn' onClick={() => openBlockList()}>
          차단 목록
        </button>

        <div className='follow-back'>
          <h3>맞팔친구</h3>
          <div>{getFollowBackList}</div>
        </div>

        <div className='follow-ing'>
          <h3>팔로잉친구</h3>
          <div>{getFollowingList}</div>
        </div>
      </div>

      <BlockList open={isBlockOpen} close={closeBlockList} />
      <SearchPop open={modalOpen} close={closeModal} />

      <button className='search' onClick={() => openModal()}>
        친구 찾기
      </button>
    </div>
  );
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
    http
      .get(`/main-schedule/${paramsYear}/${paramsMonth}`)
      .then((res) => {
        if (res.data.result === "suc") {
          getMainTask(res.data.data.mainScheduleList);
        } else if (res.data.result === "err") {
          alert("스케줄 조회에 실패하셨습니다.");
        }
      })
      .catch((err) => console.log("catch" + err));
  }, [nowMonth]);

  const [selectDate, setSelectDate] = useState(new Date());
  const [choiceFullList, setChoiceFullList] = useState([]);
  const [overList, setOverList] = useState([]);
  const [isInsertIng, setIsInsertIng] = useState(true);

  const prevMonth = () => {
    setNowMonth(subMonths(nowMonth, 1));
  };

  const nextMonth = () => {
    setNowMonth(addMonths(nowMonth, 1));
  };

  const drag = (day, type) => {
    let convertDay = new Date(day);

    let month = convertDay.getMonth() + 1;
    let date = convertDay.getDate();

    if (month < 10) {
      month = "0" + month;
    }

    if (date < 10) {
      date = "0" + date;
    }

    let fullDate = convertDay.getFullYear() + "-" + month.toString() + "-" + date.toString();

    if (type === "start") {
      // 오버 리스트 초기화
      setOverList([]);

      setIsInsertIng(false);
      if (choiceFullList.length === 0) {
        setChoiceFullList([...choiceFullList, fullDate]);
      } else {
        setChoiceFullList([fullDate, null]);
      }

      return;
    }

    if (type === "over") {
      if (isInsertIng) {
        return;
      }

      setOverList([...overList, fullDate]);
    }

    if (type === "end") {
      setIsInsertIng(true);
      if (choiceFullList.length === 0) {
        return;
      }
      // 한개 날짜가 지정되어있을 경우, 비교해서 넣기
      if (new Date(fullDate) > new Date(choiceFullList[0])) {
        setChoiceFullList([choiceFullList[0], fullDate]);
      } else {
        setChoiceFullList([fullDate, choiceFullList[0]]);
      }

      return;
    }
  };

  const pageMove = useNavigate();

  const moveUrl = (type, allTask, date) => {
    console.log(choiceFullList[0], choiceFullList[1]);

    // if (true) {
    //   return;
    // }

    if (type === "add") {
      if (choiceFullList.length < 2 || choiceFullList == null) {
        alert("날짜를 선택해주세요");
        return;
      }

      let insertParams = {
        startDate: choiceFullList[0],
        endDate: choiceFullList[1],
      };

      http
        .post("/main-schedule", insertParams)
        .then((res) => {
          if (res.data.result === "suc") {
            alert("스케줄 등록에 성공하셨습니다.");

            // 페이지 새로고침
            window.location.reload();

            // pageMove("/detail", {
            //   state: {
            //     mainScheduleId: res.data.data,
            //     insertDate: choiceFullList,
            //   },
            // });
          } else if (res.data.result === "err") {
            alert("스케줄 등록에 실패하셨습니다.");
            return;
          }
        })
        .catch((err) => console.log("catch" + err));
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
    <div>
      <Header />
      <div className='main'>
        <div className='calendar'>
          <CalHeader nowMonth={nowMonth} prevMonth={prevMonth} nextMonth={nextMonth} />
          <CalDays />
          <CalCell
            nowMonth={nowMonth}
            isInsertIng={isInsertIng}
            selectDate={selectDate}
            overList={overList}
            choiceFullList={choiceFullList}
            allTasked={mainTask}
            drag={drag}
            detailClick={(allTask, date) => moveUrl("detail", allTask, date)}
          />
          <div className='set-date'>
            <div>시작일 : {choiceFullList[0]}</div>
            <div>종료일 : {choiceFullList[1]}</div>
          </div>
          <button className='next' onClick={() => moveUrl("add")}>
            등록하기
          </button>
        </div>
        <div className='friend'>
          <FriendList />
        </div>
      </div>
    </div>
  );
};

export default Main;
