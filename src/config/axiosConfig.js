const axios = require('axios');

const BASE_URL = process.env.SANDBOX_BASE_URL;

const createAxiosInstance = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': process.env.SANDBOX_API_KEY,
    'x-api-version': '1.0.0'   // only if Sandbox docs require it
  };


  if (token) {
    headers['Authorization'] = token;
  }

  console.log("BASE URL:", BASE_URL);
  console.log("HEADERS:", headers);

  return axios.create({
    baseURL: BASE_URL,
    headers
  });
};

module.exports = { createAxiosInstance };