import axios from 'axios';

const SPORTMONKS_API_URL = 'https://api.sportmonks.com/v3';
const token = process.env.SPORTMONKS_TOKEN;

const api = axios.create({
  baseURL: SPORTMONKS_API_URL,
  params: {
    api_token: token,
  },
});

export const fetchMatches = async () => {
  try {
    const response = await api.get('/fixtures');
    return response.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

export const fetchOdds = async (fixtureId: number) => {
  try {
    const response = await api.get(`/fixtures/${fixtureId}?include=odds`);
    return response.data;
  } catch (error) {
    console.error('Error fetching odds:', error);
    throw error;
  }
};

export default api;
