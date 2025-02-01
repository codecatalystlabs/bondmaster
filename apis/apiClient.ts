// // apiClient.ts

// import useUserStore from "@/app/store/userStore";
// import { BASE_URL } from "@/constants/baseUrl";


// export const apiClient = async (url: string, options: RequestInit = {}) => {
//     const token = useUserStore.getState().token; 
//     console

//     const headers: { [key: string]: string } = {
//         'Content-Type': 'application/json',
//         ...(options.headers as { [key: string]: string }),
//     };

//     if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//     }

//     const response = await fetch(`${BASE_URL}${url}`, {
//         ...options,
//         headers,
//     });

//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return response.json();
// };





import axios from "axios";
import useUserStore from "@/app/store/userStore";
import { BASE_URL } from "@/constants/baseUrl";

// Create an Axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor to Attach Token
apiClient.interceptors.request.use(
    (config) => {
        const token = useUserStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor for Error Handling (Optional)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default apiClient;
