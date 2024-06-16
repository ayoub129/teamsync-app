import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://34.229.66.208:8000/api',
});

export default instance;
