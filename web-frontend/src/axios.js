import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://54.242.152.138:8000/api',
});

export default instance;
