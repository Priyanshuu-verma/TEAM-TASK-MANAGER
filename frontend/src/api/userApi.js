import axios from 'axios';

const getAuthHeaders = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return { headers: { Authorization: `Bearer ${userInfo?.token}` } };
};

// Fetch all users (to populate an assignment dropdown)
export const fetchAllUsers = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/users`, getAuthHeaders());
  return response.data;
};