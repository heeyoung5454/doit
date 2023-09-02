import axios from "axios";

let token = "";
if (localStorage.getItem("accessToken")) {
  token = localStorage.getItem("accessToken");
}

let http = "";

if (token) {
  http = axios.create({
    baseURL: "http://3.35.93.119:8080",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
} else {
  http = axios.create({
    baseURL: "http://3.35.93.119:8080",
  });
}

export default http;
