import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const authFetch = async (endpoint, options = {}) => {
  try {
    const response = await axios({
      url: `${API_BASE_URL}${endpoint}`,
      withCredentials: true,
      ...options
    });
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const fetchAuthUser = async () => {
  try {
    const user = await authFetch('/auth_me');
    return user;
  } catch (error) {
    console.error('Failed to fetch user data', error);
    return null;
  }
};