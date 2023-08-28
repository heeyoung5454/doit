import React from "react";
import "../../assets/alarm.scss";
import http from "utile/http";

const Alarm = (props) => {
  if (props.open) {
    const GetDataList = () => {
      let pushList = [];
      let dataList = props.pushList;
      console.log(dataList);

      if (dataList.length > 0) {
        for (let i = 0; i < dataList.length; i++) {
          pushList.push(
            <li className={dataList[i].view === "Y" ? "disable" : ""} key={i}>
              <span>{dataList[i].content}</span>
              <span className='read' onClick={() => readAlarm(dataList[i].id)}>
                읽기
              </span>
              <span className='delete' onClick={() => delAlarm(dataList[i].id)}>
                삭제
              </span>
            </li>
          );
        }
      } else {
        pushList.push(<li className='none'>알림이 없습니다.</li>);
      }

      return <div>{pushList}</div>;
    };

    // 알람 읽기
    const readAlarm = (id) => {
      http
        .patch(`/alarm/${id}`)
        .then((res) => {
          if (res.data.result === "suc") {
            alert("읽었습니다.");
          } else if (res.data.result === "err") {
            alert("알림 수신 실패했습니다.");
          }
        })
        .catch((err) => {
          alert("catch:: " + JSON.stringify(err));
        });
    };

    // 알람 삭제
    const delAlarm = (id) => {
      http
        .patch(`/alarm/delete/${id}`)
        .then((res) => {
          if (res.data.result === "suc") {
            alert("삭제햇습니다.");
          } else if (res.data.result === "err") {
            alert("알림 수신 실패했습니다.");
          }
        })
        .catch((err) => {
          alert("catch:: " + JSON.stringify(err));
        });
    };

    return (
      <div className='alarm-warp'>
        <div className='alarm-content'>
          <GetDataList />
        </div>
      </div>
    );
  }
};

export default Alarm;
