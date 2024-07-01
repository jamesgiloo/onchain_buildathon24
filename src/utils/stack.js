// src/utils/stack.js
import axios from 'axios';

const apiBaseUrl = 'https://192.168.50.103:5001/api'; // 替换为你的后端服务器地址

const addPoint = async (eventName, user, points) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/addPoint`, { eventName, user, points });
    return response.data;
  } catch (error) {
    console.error('Error adding points:', error);
    throw error;
  }
};

const getPoints = async (users) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/getPoints`, { users });
    return response.data;
  } catch (error) {
    console.error('Error fetching points:', error);
    throw error;
  }
};

const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/leaderboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    throw error;
  }
};

export { addPoint, getPoints, getLeaderboard };
