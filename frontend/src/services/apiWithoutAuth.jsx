import axios from 'axios';

const baseURL = 'http://172.17.231.72:8005/api';

// Create an API instance without authentication interceptors
const apiWithoutAuth = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiWithoutAuth;