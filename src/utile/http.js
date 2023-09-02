import axios from "axios";

let token = null;
if (localStorage.getItem("token")) {
  token = localStorage.getItem("token");
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
