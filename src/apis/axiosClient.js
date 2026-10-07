import axios from 'axios';
const axiosClient = axios.create({
  baseURL: 'https://be-project-reactjs.onrender.com/api/v1',
  timeout: 10000, // optional: Set timeout for requests (in ms)
  headers: {
    'Content-Type': 'application/json', // Set common headers (optional)
  },
});
export default axiosClient;
