import axios from 'axios';
import { SESSION_KEY } from '../contexts/authContext';
const axiosClient = axios.create({
  baseURL: 'https://be-project-reactjs.onrender.com/api/v1',
  timeout: 15000, // optional: Set timeout for requests (in ms)
  headers: {
    'Content-Type': 'application/json', // Set common headers (optional)
  },
});

axiosClient.interceptors.request.use((config) => {
  try {
    const session = JSON.parse(window.localStorage.getItem(SESSION_KEY) ?? 'null');
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
  } catch {
    // Ignore malformed local session data.
  }
  return config;
});

export default axiosClient;
