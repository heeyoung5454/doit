import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

import "../../assets/alarm.scss";

const GetPushList = (props) => {
  const [dataList, setDataList] = useState([]); // 알림 메세지 리스트

  const pushList = [];
  setDataList(props.pushList);
  console.log(dataList);

  for (let i = 0; i < dataList.length; i++) {
    pushList.push(
      <li className='push-list' key={i}>
        {dataList[i].content}
      </li>
    );
  }

  return <div>{{ pushList }}</div>;
};

const Alarm = (props) => {
  if (props.open) {
    return (
      <div className='alarm-warp'>
        <div className='alarm-content'>
          <GetPushList />
        </div>
      </div>
    );
  }
};

export default Alarm;
