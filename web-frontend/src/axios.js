import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://18.204.6.186:8000/api',
});

export default instance;
