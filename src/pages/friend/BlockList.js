import React, { useState, useEffect } from "react";
import "../../assets/blockList.scss";
import http from "utile/http";

const BlockList = (props) => {
  const [blockList, setBlockList] = useState([]);

  useEffect(() => {
    // 차단 목록 api호출
    http
      .get("/friends/block")
      .then((res) => {
        if (res.data.result === "suc") {
          setBlockList(res.data.data.blockList);
          console.log(res.data.data.blockList);
        } else if (res.data.result === "err") {
          alert("차단목록 불러오기에 실패하셨습니다.");
        }
      })
      .catch((err) => console.log("catch" + err));
  }, []);

  const PrintBlock = () => {
    let userBlockList = [];

    if (blockList.length === 0) {
      userBlockList.push("차단 목록이 없습니다.");

      return userBlockList;
    }

    for (let i = 0; i < blockList.length; i++) {
      userBlockList.push(<li key={i}> {blockList[i].nickname}</li>);
    }

    return <ul>{userBlockList}</ul>;
  };

  if (props.open) {
    return (
      <div className='block-list'>
        <div className='close btn' onClick={props.close}>
          X
        </div>
        <PrintBlock />
      </div>
    );
  }
};

export default BlockList;
