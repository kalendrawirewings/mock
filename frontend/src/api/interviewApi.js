import axiosInstance from './axiosInstance';

export const interviewApi = {
  create: async (sessionData) => {
    const response = await axiosInstance.post('/interviews', sessionData);
    return response.data;
  },

  update: async (id, sessionData) => {
    const response = await axiosInstance.put(`/interviews/${id}`, sessionData);
    return response.data;
  },

  getAll: async () => {
    const response = await axiosInstance.get('/interviews');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/interviews/${id}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/interviews/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get('/interviews/stats');
    return response.data;
  },

  saveQuestion: async (sessionId, questionData) => {
    const response = await axiosInstance.post(
      `/interviews/${sessionId}/questions`,
      questionData
    );
    return response.data;
  },

  saveConversation: async (sessionId, entryData) => {
    const response = await axiosInstance.post(
      `/interviews/${sessionId}/conversation`,
      entryData
    );
    return response.data;
  },

  saveResource: async (sessionId, resourceData) => {
    const response = await axiosInstance.post(
      `/interviews/${sessionId}/resources`,
      resourceData
    );
    return response.data;
  },
};
