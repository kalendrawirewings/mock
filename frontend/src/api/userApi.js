import axiosInstance from './axiosInstance';

export const userApi = {
  getProfile: async () => {
    const response = await axiosInstance.get('/user/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await axiosInstance.put('/user/profile', userData);
    return response.data;
  },
};

export default userApi;
