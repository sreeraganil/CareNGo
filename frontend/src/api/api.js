    import axios from "axios";

    const API_BASE_URL = "https://59f83745a032.ngrok-free.app/api"; 

    const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
    },
    });


    api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token"); // you save token here after login
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
    );

    export default api;
