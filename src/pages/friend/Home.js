import { useLocation } from "react-router-dom";
import http from "utile/http";
import "../../assets/home.scss";

//친구 추가 api호출
const addFriend = (memberId) => {
  http
    .post("/friends?friendId=" + memberId)
    .then((res) => {
      if (res.data.result === "suc") {
        alert("성공하셨습니다.");
      } else if (res.data.result === "err") {
        alert("실패하셨습니다.");
        return;
      }
    })
    .catch((err) => console.log("catch :: " + err));
};

//친구 차단 api호출
const blockFriend = (friendId) => {
  http
    .post("/friends/block?friendId=" + friendId)
    .then((res) => {
      if (res.data.result === "suc") {
        alert("차단하였습니다.");
      } else if (res.data.result === "err") {
        alert("차단실패하셨습니다.");
      }
    })
    .catch((err) => console.log("catch" + err))
    .finally(() => {
      // 차단 후 페이지 이동
      window.location.replace("/main");
    });
};

const Home = () => {
  const location = useLocation();
  let memberId = location.state.memberId;
  let nickname = location.state.nickname;

  return (
    <div className='home'>
      <div className='header'>
        <div>{nickname}</div>
        <div className='add' onClick={() => addFriend(memberId)}>
          추가
        </div>

        <div className='block' onClick={() => blockFriend(memberId)}>
          차단
        </div>
      </div>
    </div>
  );
};

export default Home;
