import axiosInstance from './axiosInstance';

export const resumeApi = {
  create: async (resumeData) => {
    const response = await axiosInstance.post('/resumes', resumeData);
    return response.data;
  },

  getAll: async () => {
    const response = await axiosInstance.get('/resumes');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/resumes/${id}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/resumes/${id}`);
    return response.data;
  },
};
