import { Cookies } from "react-cookie";

const cookies = new Cookies();

//쿠키 저장
export const setCookie = (name, value) => {
  cookies.set(name, value, {
    path: "/",
  });
};

//쿠키 조회
export const getCookie = (name) => {
  return cookies.get(name);
};

//쿠키 삭제
export const deleteCookie = (name) => {
  return cookies.remove(name, { path: "http://localhost:3000/" });
};
