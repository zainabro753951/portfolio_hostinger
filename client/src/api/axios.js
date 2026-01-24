import axios from "axios";

const api = axios.create({
  baseURL: "https://zaincode.io/api",
  withCredentials: true, // ✅ this is crucial
});

export default api;
