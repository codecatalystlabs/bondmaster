



import axios from "axios";
import useUserStore from "@/app/store/userStore";
import { BASE_URL } from "@/constants/baseUrl";
import toast from "react-hot-toast";

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
        if (error.response) {
            // Server responded with a status code outside 2xx
            const errorMessage = error.response.data?.message || "An error occurred. Please try again.";
            toast.error(errorMessage); 
           
        } else if (error.request) {
            // No response received
            toast.error("No response received from the server. Please check your connection.");
        } else {
            // Something went wrong in setting up the request
            toast.error("An error occurred while setting up the request.");
          
        }
        return Promise.reject(error);
    }
);

export default apiClient;
