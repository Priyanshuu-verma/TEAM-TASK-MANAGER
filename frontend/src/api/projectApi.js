import axios from 'axios';

// Helper to get the token from LocalStorage
const getAuthHeaders = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
    },
  };
};

export const createProject = async (projectData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/projects`, 
    projectData, 
    getAuthHeaders()
  );
  return response.data;
};

export const fetchProjects = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/projects`, 
    getAuthHeaders()
  );
  return response.data;
};