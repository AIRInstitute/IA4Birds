import axios from "axios";

//const API_URL = process.env.REACT_APP_BACKEND_URL + ":" + process.env.REACT_APP_HTTP_PORT + "/api";
const API_URL1 = "http://localhost" + ":" + "5030" + "/api";
//const API_URL1 = "http://212.128.154.81" + ":" + "5030" + "/api";
//const API_URL1 = `http://${process.env.BACKEND_URL}/api`;
//dockconst API_URL1 = `http://${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_HTTP_PORT}/api`;
console.log('API_URL:', API_URL1);

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