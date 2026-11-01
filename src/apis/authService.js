import axiosClient from './axiosClient';

const AUTH_ENDPOINTS = {
  register: '/register',
  login: '/login',
};

export async function register(payload) {
  const response = await axiosClient.post(AUTH_ENDPOINTS.register, payload);
  return response.data;
}

export async function login(payload) {
  const response = await axiosClient.post(AUTH_ENDPOINTS.login, payload);
  const authorization = response.headers?.authorization ?? response.headers?.Authorization;
  return {
    payload: response.data,
    headerToken: authorization?.replace(/^Bearer\s+/i, ''),
  };
}
