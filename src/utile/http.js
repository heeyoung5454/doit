import axios from "axios";

let token = "";
if (localStorage.getItem("accessToken")) {
  token = localStorage.getItem("accessToken");
}

export const http = axios.create({
  baseURL: "http://3.35.93.119:8080",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const noTokenHttp = axios.create({
  baseURL: "http://3.35.93.119:8080",
});

export const logOutHttp = axios.create({
  baseURL: "http://3.35.93.119:8080",
  headers: {
    AccessToken: ` ${token}`,
  },
});

export default http;
