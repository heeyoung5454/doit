import axios from "axios";

let token = "";
if (localStorage.getItem("token")) {
  token = localStorage.getItem("token");
}

const http = axios.create({
  baseURL: "http://3.35.93.119:8080",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default http;
