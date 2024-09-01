import axios from "axios";
const api = axios.create({
    // baseURL: "http://localhost:3000/",
    baseURL: "http://35.154.46.198:3000",
    withCredentials: true,
});

export default api;
