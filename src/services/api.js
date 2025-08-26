import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1/3000/api', // IP locale si en dev
});

export default api;
