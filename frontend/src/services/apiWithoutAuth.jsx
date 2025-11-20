import axios from 'axios';

<<<<<<< HEAD
const baseURL = import.meta.env.VITE_API_URL;
=======
//const baseURL = 'http://172.17.231.72:8005/api';
const baseURL = 'http://127.0.0.1:8000/api';
>>>>>>> 9730ca2a5c88d874d60230aebf99f8ac2bad8c23

// Create an API instance without authentication interceptors
const apiWithoutAuth = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiWithoutAuth;