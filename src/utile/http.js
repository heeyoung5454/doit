import axios from "axios";

const http = axios.create({
  baseURL: "http://3.35.93.119:8080",
});

export default http;
