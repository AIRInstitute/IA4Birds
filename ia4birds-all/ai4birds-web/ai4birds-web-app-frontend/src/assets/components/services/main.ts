import axios from "axios";

//const API_URL = process.env.REACT_APP_BACKEND_URL + ":" + process.env.REACT_APP_HTTP_PORT + "/api";
const API_URL1 = "http://ia4birds-platform.air-institute.com" + ":" + "3030" + "/api";

//console.log(API_URL);

const api = axios.create({
  baseURL: API_URL1,
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// api.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error) => {
//         if (error.response.status === 401) {
//         localStorage.removeItem("user");
//         window.location.reload();
//         }
//         return Promise.reject(error);
//     }
//     );

export default api;