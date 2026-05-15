import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const startInvestigation = async (data: { target: string; type: string }) => {
  const response = await api.post('/investigate', data);
  return response.data;
};

export const getInvestigation = async (id: number) => {
  const response = await api.get(`/investigation/${id}`);
  return response.data;
};

export const getReport = async (id: number) => {
  const response = await api.get(`/report/${id}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getAgentLogs = async (id: number) => {
  const response = await api.get(`/agent/logs/${id}`);
  return response.data;
};
