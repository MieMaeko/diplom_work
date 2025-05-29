import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001', // Укажите ваш сервер
  withCredentials: true, // Убедитесь, что куки отправляются с запросом
});

export default instance;