import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

// Create an API instance without authentication interceptors
const apiWithoutAuth = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiWithoutAuth;