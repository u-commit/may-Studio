import axiosClient from './axiosClient';
const getProduct = async () => {
  const response = await axiosClient.get('/product');

  return response.data;
};
export { getProduct };
