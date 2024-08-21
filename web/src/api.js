import axios from 'axios';

const baseURL = process.env.VITE_IP_ADDRESS || 'http://0.0.0.0:8000';

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export default api;

