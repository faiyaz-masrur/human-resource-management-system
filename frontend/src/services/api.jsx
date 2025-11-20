import axios from 'axios';

<<<<<<< HEAD
const baseURL = import.meta.env.VITE_API_URL;
=======
//const baseURL = 'http://172.17.231.72:8005/api';
const baseURL = 'http://127.0.0.1:8000/api';
>>>>>>> 9730ca2a5c88d874d60230aebf99f8ac2bad8c23

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (as before)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response, // Simply return the response if it's successful
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and it's not a retry request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark it as a retry

      try {
        const refreshToken = localStorage.getItem('refreshToken');
       const response = await axios.post(`${baseURL}/system/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        // Store the new tokens
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);

        // Update the header for the original request
        originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout the user
        console.log('Refresh token is invalid. Logging out.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
