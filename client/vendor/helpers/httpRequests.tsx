import axios from 'axios';
import { getToken } from './expoSecureStore';

const baseUrl = 'http://localhost:3000/'

const httpRequest = {
  post: async(route: string, body:{}) => {
    if (route.includes('/login') || route.includes('/signup')) {
      return await axios.post(`${baseUrl}${route}`, body);
    } else {
      const token = await getToken('token');
      const headers = { token, 'Content-Type': 'application/json' };
      return await axios.post(`${baseUrl}${route}`, body, { headers });
    }
  },

  get: async(route: string) => {
    const token = await getToken('token');
    const headers = { token, 'Content-Type': 'application/json' };
    return await axios.get(`${baseUrl}${route}`, { headers });
  }
}

export default httpRequest;
