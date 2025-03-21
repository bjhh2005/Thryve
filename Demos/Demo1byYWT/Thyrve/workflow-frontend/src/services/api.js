import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const executeWorkflow = async (workflow) => {
  const response = await axios.post(`${API_BASE_URL}/workflow/execute`, workflow);
  return response.data;
};

export const getNodeTypes = async () => {
  const response = await axios.get(`${API_BASE_URL}/nodes/types`);
  return response.data;
};