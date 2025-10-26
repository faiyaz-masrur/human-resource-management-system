import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api';


const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (as before)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
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
        const refreshToken = localStorage.getItem('refresh_token');
       const response = await axios.post(`${baseURL}/system/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        // Store the new tokens
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        // Update the header for the original request
        originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout the user
        console.log('Refresh token is invalid. Logging out.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
