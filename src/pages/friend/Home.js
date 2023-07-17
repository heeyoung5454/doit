import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  console.log(location.state, "ffff");
  let memberId = location.state.memberId;
  console.log(memberId, "ddd");
};

export default Home;
