import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://35.175.102.49:8000/api',
});

export default instance;
