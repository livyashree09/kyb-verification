const axios = require('axios');

const BASE_URL = process.env.SANDBOX_BASE_URL;

const createAxiosInstance = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': process.env.SANDBOX_API_KEY,
    'x-api-version': '2.0',
  };

  if (token) {
    headers['authorization'] = token;   // FIXED (lowercase)
  }

  return axios.create({
    baseURL: BASE_URL,
    headers,
  });
};

module.exports = { createAxiosInstance };