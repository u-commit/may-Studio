import axiosClient from './axiosClient';
const getProduct = async (params = {}) => {
  const response = await axiosClient.get('/product', { params });

  return response.data;
};
export { getProduct };
