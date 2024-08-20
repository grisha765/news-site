import axios from 'axios';

const api = axios.create({
  baseURL: 'http://0.0.0.0:8000',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export default api;

