import axios from 'axios';
import { getData } from './expoSecureStore';

const baseUrl = 'http://192.168.1.13:3000/'

const httpRequest = {
  post: async(route: string, body:{}) => {
    if (route.includes('/login') || route.includes('/create-account')) {
      return await axios.post(`${baseUrl}${route}`, body);
    } else {
      const token = await getData('token');
      const headers = { token, 'Content-Type': 'application/json' };
      return await axios.post(`${baseUrl}${route}`, body, { headers });
    }
  },

  get: async(route: string) => {
    const token = await getData('token');
    const headers = { token, 'Content-Type': 'application/json' };
    return await axios.get(`${baseUrl}${route}`, { headers });
  },

  put: async(route: string, body: {}) => {
    const token = await getData('token');
    const headers = { token, 'Content-Type': 'application/json' };
    return await axios.put(`${baseUrl}${route}`, body, { headers });
  }
}

export default httpRequest;
